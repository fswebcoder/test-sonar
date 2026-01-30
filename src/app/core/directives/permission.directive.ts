import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthPermissions } from '@/store/selectors/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

export interface PermissionConfig {
  action?: string;
  path?: string;
  resource?: string;
  application?: string;
  subresource?: string;
  requireAll?: boolean;
  fallback?: 'hide' | 'disable';
}

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnDestroy {
  private readonly store = inject(Store);
  private readonly elementRef = inject(ElementRef);
  private readonly destroy$ = new Subject<void>();

  @Input() appPermission: PermissionConfig | string = '';

  private readonly permissionsSignal = signal<any>(null);
  private readonly hasPermissionSignal = signal<boolean>(false);

  private readonly permissionComputed = computed(() => {
    const permissions = this.permissionsSignal();
    const config = this.parsePermissionConfig();

    if (!permissions || !config) {
      return false;
    }

    const hasPermission = this.checkPermission(permissions, config);
    return hasPermission;
  });

  private readonly permissionEffect = effect(() => {
    const hasPermission = this.permissionComputed();
    this.hasPermissionSignal.set(hasPermission);
    this.applyPermissionToElement(hasPermission);
  });

  constructor() {
    this.initializePermissions();
  }

 

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializePermissions(): void {
    this.store.select(selectAuthPermissions)
      .pipe(takeUntilDestroyed())
      .subscribe(permissions => {
        this.permissionsSignal.set(permissions);
      });
  }


  private parsePermissionConfig(): PermissionConfig | null {
    if (typeof this.appPermission === 'string') {
      return { action: this.appPermission };
    }
    
    if (typeof this.appPermission === 'object' && this.appPermission !== null) {
      return this.appPermission as PermissionConfig;
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
        const normalizedItemPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;
        if (normalizedItemPath === normalizedTargetPath) {
          if (!action) {
            return true; 
          }
          
          const hasAction = this.checkActionPermission(item.actions, action);
          return hasAction;
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

  private checkActionPermission(userActions: any[] | undefined, requiredAction: string): boolean {

    if (!userActions || !Array.isArray(userActions)) {
      return false;
    }

    let actionsToCheck: any[] = [];
    
    if (userActions.length > 0 && Array.isArray(userActions[0])) {
      actionsToCheck = userActions[0];
    } else {
      actionsToCheck = userActions;
    }
    

    const hasAction = actionsToCheck.some(action => {
      const actionString = typeof action === 'string' ? action : String(action);
      const matches = actionString.toLowerCase() === requiredAction.toLowerCase();
      return matches;
    });
    
    return hasAction;
  }

  private applyPermissionToElement(hasPermission: boolean): void {
    const element = this.elementRef.nativeElement;
    const config = this.parsePermissionConfig();
    const fallback = config?.fallback || 'hide';
    if (hasPermission) {
      element.style.display = '';
      element.disabled = false;
      element.classList.remove('permission-denied');
    } else {
      if (fallback === 'hide') {
        element.style.display = 'none';
      } else if (fallback === 'disable') {
        element.disabled = true;
        element.classList.add('permission-denied');
      }
    }
  }

  
  public hasPermission(): boolean {
    return this.hasPermissionSignal();
  }
} 