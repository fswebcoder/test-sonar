import { Injectable, inject, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthPermissions } from '@/store/selectors/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PermissionConfig } from '../directives/permission.directive';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly store = inject(Store);

  private readonly permissionsSignal = signal<any>(null);
  private readonly hasPermissionComputed = computed(() => {
    return (config: PermissionConfig | string): boolean => {
      const permissions = this.permissionsSignal();
      const parsedConfig = this.parsePermissionConfig(config);
      
      if (!permissions || !parsedConfig) {
        return false;
      }

      return this.checkPermission(permissions, parsedConfig);
    };
  });

  constructor() {
    this.initializePermissions();
  }


  private initializePermissions(): void {
    this.store.select(selectAuthPermissions)
      .pipe(takeUntilDestroyed())
      .subscribe(permissions => {
        this.permissionsSignal.set(permissions);
      });
  }

 
  public hasPermission(config: PermissionConfig | string): boolean {
    return this.hasPermissionComputed()(config);
  }


  public hasAllPermissions(configs: (PermissionConfig | string)[]): boolean {
    return configs.every(config => this.hasPermission(config));
  }


  public hasAnyPermission(configs: (PermissionConfig | string)[]): boolean {
    return configs.some(config => this.hasPermission(config));
  }


  public getPermissions(): any {
    return this.permissionsSignal();
  }

  public getResourceActions(resource: string, application?: string): string[] {
    const permissions = this.permissionsSignal();
    if (!permissions?.menuItems) {
      return [];
    }

    const actions: string[] = [];
    const menuItems = permissions.menuItems;

    if (application) {
      const app = menuItems.find((app: any) => app.label?.toLowerCase() === application.toLowerCase());
      if (app?.items) {
        this.extractActionsFromItems(app.items, resource, actions);
      }
    } else {
      menuItems.forEach((app: any) => {
        if (app.items) {
          this.extractActionsFromItems(app.items, resource, actions);
        }
      });
    }

    return [...new Set(actions)];
  }

  public getSubresourceActions(resource: string, subresource: string, application?: string): string[] {
    const permissions = this.permissionsSignal();
    if (!permissions?.menuItems) {
      return [];
    }

    const actions: string[] = [];
    const menuItems = permissions.menuItems;

    if (application) {
      const app = menuItems.find((app: any) => app.label?.toLowerCase() === application.toLowerCase());
      if (app?.items) {
        this.extractSubresourceActions(app.items, resource, subresource, actions);
      }
    } else {
      menuItems.forEach((app: any) => {
        if (app.items) {
          this.extractSubresourceActions(app.items, resource, subresource, actions);
        }
      });
    }

    return [...new Set(actions)]; 
  }

 
  public getPathActions(path: string): string[] {
    const permissions = this.permissionsSignal();
    if (!permissions?.menuItems) {
      return [];
    }

    const actions: string[] = [];
    const menuItems = permissions.menuItems;

    for (const app of menuItems) {
      if (app.items) {
        this.extractActionsByPath(app.items, path, actions);
      }
    }

    return [...new Set(actions)]; 
  }


  public hasPathAccess(path: string): boolean {
    return this.hasPermission({ path });
  }


  public getAvailablePaths(): string[] {
    const permissions = this.permissionsSignal();
    if (!permissions?.menuItems) {
      return [];
    }

    const paths: string[] = [];
    const menuItems = permissions.menuItems;

    for (const app of menuItems) {
      if (app.items) {
        this.extractPaths(app.items, paths);
      }
    }

    return [...new Set(paths)]; 
  }

 
  public debugPaths(): void {
    const permissions = this.permissionsSignal();
    if (!permissions?.menuItems) {
      return;
    }
    this.debugPathsRecursive(permissions.menuItems, '');
  }

  private debugPathsRecursive(items: any[], prefix: string): void {
    for (const item of items) {
      if (item.routerLink && Array.isArray(item.routerLink) && item.routerLink[0]) {
        const originalPath = item.routerLink[0];
        const normalizedPath = originalPath.startsWith('/') ? originalPath.slice(1) : originalPath;
        console.info(`${prefix}Original: "${originalPath}" → Normalized: "${normalizedPath}"`);
      }
      
      if (item.items && Array.isArray(item.items)) {
        this.debugPathsRecursive(item.items, prefix + '  ');
      }
    }
  }


  private parsePermissionConfig(config: PermissionConfig | string): PermissionConfig | null {
    if (typeof config === 'string') {
      return { action: config };
    }
    
    if (typeof config === 'object' && config !== null) {
      return config as PermissionConfig;
    }

    return null;
  }


  private checkPermission(permissions: any, config: PermissionConfig): boolean {
    const { action, path, resource, application, subresource, requireAll = false } = config;

    if (!permissions?.menuItems) {
      return false;
    }

    if (path) {
      return this.checkPermissionByPath(permissions, path, action);
    }

    const menuItems = permissions.menuItems;
    const permissionsToCheck: boolean[] = [];

    if (application) {
      const app = menuItems.find((app: any) => app.label?.toLowerCase() === application.toLowerCase());
      if (app?.items) {
        permissionsToCheck.push(...this.extractPermissionsFromItems(app.items, resource, subresource, action));
      }
    } else {
      menuItems.forEach((app: any) => {
        if (app.items) {
          permissionsToCheck.push(...this.extractPermissionsFromItems(app.items, resource, subresource, action));
        }
      });
    }

    if (permissionsToCheck.length === 0) {
      return false;
    }

    if (requireAll) {
      return permissionsToCheck.every(perm => perm === true);
    }

    return permissionsToCheck.some(perm => perm === true);
  }

  private checkPermissionByPath(permissions: any, path: string, action?: string): boolean {
    const menuItems = permissions.menuItems;
    
    for (const app of menuItems) {
      if (app.items) {
        const found = this.findPermissionByPath(app.items, path, action);
        if (found) {
          return true;
        }
      }
    }
    
    return false;
  }

  private findPermissionByPath(items: any[], targetPath: string, action?: string): boolean {
    const normalizedTargetPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
    for (const item of items) {
      if (item.routerLink && Array.isArray(item.routerLink)) {
        const itemPath = item.routerLink[0];
        const normalizedItemPath = typeof itemPath === 'string' && itemPath.startsWith('/')
          ? itemPath.slice(1)
          : itemPath;
        if (normalizedItemPath === normalizedTargetPath) {
          if (!action) {
            return true;
          }
          return this.checkActionPermission(item.actions, action);
        }
      }
      if (item.items && Array.isArray(item.items)) {
        const found = this.findPermissionByPath(item.items, normalizedTargetPath, action);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  private extractPermissionsFromItems(items: any[], resource?: string, subresource?: string, action?: string): boolean[] {
    const permissions: boolean[] = [];

    items.forEach(item => {
      if (resource && item.label?.toLowerCase() !== resource.toLowerCase()) {
        return;
      }

      if (item.items && Array.isArray(item.items)) {
        if (subresource) {
          const subItem = item.items.find((sub: any) => 
            sub.label?.toLowerCase() === subresource.toLowerCase()
          );
          if (subItem && action) {
            permissions.push(this.checkActionPermission(subItem.actions, action));
          }
        } else {
          if (action) {
            permissions.push(this.checkActionPermission(item.actions, action));
          }
        }
      } else {
        if (action) {
          permissions.push(this.checkActionPermission(item.actions, action));
        }
      }
    });

    return permissions;
  }

 
  private extractActionsFromItems(items: any[], resource: string, actions: string[]): void {
    items.forEach(item => {
      if (item.label?.toLowerCase() === resource.toLowerCase()) {
        if (item.actions && Array.isArray(item.actions)) {
          actions.push(...item.actions);
        }
      }
    });
  }

  private extractSubresourceActions(items: any[], resource: string, subresource: string, actions: string[]): void {
    items.forEach(item => {
      if (item.label?.toLowerCase() === resource.toLowerCase() && item.items) {
        const subItem = item.items.find((sub: any) => 
          sub.label?.toLowerCase() === subresource.toLowerCase()
        );
        if (subItem?.actions && Array.isArray(subItem.actions)) {
          actions.push(...subItem.actions);
        }
      }
    });
  }

  private extractActionsByPath(items: any[], targetPath: string, actions: string[]): void {
    const normalizedTargetPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
    
    for (const item of items) {
      if (item.routerLink && Array.isArray(item.routerLink) && item.routerLink[0] === normalizedTargetPath) {
        if (item.actions && Array.isArray(item.actions)) {
          actions.push(...item.actions);
        }
        return;
      }
      
      if (item.items && Array.isArray(item.items)) {
        this.extractActionsByPath(item.items, normalizedTargetPath, actions);
      }
    }
  }


  private extractPaths(items: any[], paths: string[]): void {
    for (const item of items) {
      if (item.routerLink && Array.isArray(item.routerLink) && item.routerLink[0]) {
        const path = item.routerLink[0];
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
        paths.push(normalizedPath);
      }
      if (item.items && Array.isArray(item.items)) {
        this.extractPaths(item.items, paths);
      }
    }
  }

  private checkActionPermission(userActions: string[] | undefined, requiredAction: string): boolean {
    if (!userActions || !Array.isArray(userActions)) {
      return false;
    }

    let actionsToCheck: string[] = [];
    if (userActions.length > 0 && Array.isArray(userActions[0])) {
      actionsToCheck = userActions[0];
    } else {
      actionsToCheck = userActions;
    }

    const hasAction = actionsToCheck.some(action => {
      return action.toLowerCase() === requiredAction.toLowerCase();
    });
    return hasAction;
  }
} 