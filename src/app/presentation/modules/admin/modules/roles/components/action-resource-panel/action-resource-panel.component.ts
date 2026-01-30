import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { CollapsiblePanelComponent } from '@/shared/components/collapsible-panel/collapsible-panel.component';
import { ActionResourceItemComponent } from '../action-resource-item/action-resource-item.component';
import { ICONS } from '@/shared/enums/general.enum';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface IResourceGroup {
  resourceId: string;
  resourceName: string;
  resourceDescription: string | null;
  actions: IActionEntity[];
  selectedCount: number;
  totalCount: number;
}

interface IParentGroup {
  parentId: string;
  parentName: string;
  resources: IResourceGroup[];
  selectedCount: number;
  totalCount: number;
}

interface IApplicationGroup {
  applicationId: string;
  applicationName: string;
  parents: IParentGroup[];
  selectedCount: number;
  totalCount: number;
}

@Component({
  selector: 'svi-action-resource-panel',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    ButtonComponent,
    FloatInputComponent,
    CollapsiblePanelComponent,
    ActionResourceItemComponent,
    ReactiveFormsModule
  ],
  templateUrl: './action-resource-panel.component.html',
  styleUrl: './action-resource-panel.component.scss'
})
export class ActionResourcePanelComponent {
  actions = input.required<IActionEntity[]>();
  selectedActionIds = input.required<string[]>();
  protectedActions = input.required<string[]>();
  isReadOnly = input<boolean>(false);

  filterText = signal<string>('');
  destroyRef = inject(DestroyRef);

  form!: FormGroup;

  actionsChange = output<string[]>();

  ICONS = ICONS;

  ngOnInit(): void {
    this.createForm();
    this.listenToFilterChanges();
  }

  createForm() {
    this.form = new FormGroup({
      filterText: new FormControl(null, [])
    });
  }

  listenToFilterChanges() {
    this.form
      .get('filterText')
      ?.valueChanges.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterText.set(value);
      });
  }

  getActionsByResource(): IApplicationGroup[] {
    const applications = this.buildApplicationsMap();
    this.calculateSelectedCounts(applications);
    this.sortApplicationsData(applications);

    const sortedApplications = Array.from(applications.values()).sort((a, b) =>
      a.applicationName.localeCompare(b.applicationName)
    );

    return this.applyFilter(sortedApplications);
  }

  private buildApplicationsMap(): Map<string, IApplicationGroup> {
    const applications = new Map<string, IApplicationGroup>();
    const uniqueActions = this.getUniqueActions();

    uniqueActions.forEach(action => {
      const appId = action.resource.application.id;
      const parentId = action.resource.parent.id;
      const resourceId = action.resource.id;

      const app = this.getOrCreateApplication(applications, action, appId);
      const parentGroup = this.getOrCreateParentGroup(app, action, parentId);
      const resourceGroup = this.getOrCreateResourceGroup(parentGroup, action, resourceId);

      this.addActionToResourceGroup(resourceGroup, action, parentGroup, app);
    });

    return applications;
  }

  private getUniqueActions(): IActionEntity[] {
    return this.actions().filter((action, index, self) => index === self.findIndex(a => a.id === action.id));
  }

  private getOrCreateApplication(
    applications: Map<string, IApplicationGroup>,
    action: IActionEntity,
    appId: string
  ): IApplicationGroup {
    if (!applications.has(appId)) {
      applications.set(appId, {
        applicationId: appId,
        applicationName: action.resource.application.name,
        parents: [],
        selectedCount: 0,
        totalCount: 0
      });
    }
    return applications.get(appId)!;
  }

  private getOrCreateParentGroup(app: IApplicationGroup, action: IActionEntity, parentId: string): IParentGroup {
    let parentGroup = app.parents.find(p => p.parentId === parentId);
    if (!parentGroup) {
      parentGroup = {
        parentId: parentId,
        parentName: action.resource.parent.name,
        resources: [],
        selectedCount: 0,
        totalCount: 0
      };
      app.parents.push(parentGroup);
    }
    return parentGroup;
  }

  private getOrCreateResourceGroup(
    parentGroup: IParentGroup,
    action: IActionEntity,
    resourceId: string
  ): IResourceGroup {
    let resourceGroup = parentGroup.resources.find(r => r.resourceId === resourceId);
    if (!resourceGroup) {
      resourceGroup = {
        resourceId: resourceId,
        resourceName: action.resource.name,
        resourceDescription: action.resource.description,
        actions: [],
        selectedCount: 0,
        totalCount: 0
      };
      parentGroup.resources.push(resourceGroup);
    }
    return resourceGroup;
  }

  private addActionToResourceGroup(
    resourceGroup: IResourceGroup,
    action: IActionEntity,
    parentGroup: IParentGroup,
    app: IApplicationGroup
  ): void {
    resourceGroup.actions.push(action);
    resourceGroup.totalCount++;
    parentGroup.totalCount++;
    app.totalCount++;
  }

  private calculateSelectedCounts(applications: Map<string, IApplicationGroup>): void {
    applications.forEach(app => {
      app.parents.forEach(parent => {
        parent.resources.forEach(resource => {
          resource.selectedCount = resource.actions.filter((action: IActionEntity) =>
            this.selectedActionIds().includes(action.id)
          ).length;
        });
        parent.selectedCount = parent.resources.reduce((sum, resource) => sum + resource.selectedCount, 0);
      });
      app.selectedCount = app.parents.reduce((sum, parent) => sum + parent.selectedCount, 0);
    });
  }

  private sortApplicationsData(applications: Map<string, IApplicationGroup>): void {
    applications.forEach(app => {
      app.parents.forEach(parent => {
        parent.resources.sort((a, b) => a.resourceName.localeCompare(b.resourceName));
      });
      app.parents.sort((a, b) => a.parentName.localeCompare(b.parentName));
    });
  }

  private applyFilter(applications: IApplicationGroup[]): IApplicationGroup[] {
    if (!this.filterText()) {
      return applications;
    }

    const filter = this.filterText().toLowerCase();
    return applications.map(app => this.filterApplication(app, filter)).filter(app => app.parents.length > 0);
  }

  private filterApplication(app: IApplicationGroup, filter: string): IApplicationGroup {
    return {
      ...app,
      parents: app.parents
        .map(parent => this.filterParent(parent, app, filter))
        .filter(parent => parent.resources.length > 0)
    };
  }

  private filterParent(parent: IParentGroup, app: IApplicationGroup, filter: string): IParentGroup {
    return {
      ...parent,
      resources: parent.resources.filter(resource => this.resourceMatchesFilter(resource, parent, app, filter))
    };
  }

  private resourceMatchesFilter(
    resource: IResourceGroup,
    parent: IParentGroup,
    app: IApplicationGroup,
    filter: string
  ): boolean {
    return (
      resource.resourceName.toLowerCase().includes(filter) ||
      (resource.resourceDescription && resource.resourceDescription.toLowerCase().includes(filter)) ||
      parent.parentName.toLowerCase().includes(filter) ||
      app.applicationName.toLowerCase().includes(filter)
    );
  }

  onFilterChange(event: any) {
    const value = event.target.value;
    this.filterText.set(value);
  }

  clearFilter() {
    this.filterText.set('');
  }

  getFilteredActionsCount(): number {
    return this.getActionsByResource().reduce(
      (total, app) => total + app.parents.reduce((parentTotal, parent) => parentTotal + parent.resources.length, 0),
      0
    );
  }

  getTotalActionsCount(): number {
    const applications = new Map<string, Map<string, Set<string>>>();

    this.actions().forEach(action => {
      const appId = action.resource.application.id;
      const parentId = action.resource.parent.id;
      const resourceId = action.resource.id;

      if (!applications.has(appId)) {
        applications.set(appId, new Map<string, Set<string>>());
      }

      const app = applications.get(appId)!;
      if (!app.has(parentId)) {
        app.set(parentId, new Set<string>());
      }

      app.get(parentId)!.add(resourceId);
    });

    return Array.from(applications.values()).reduce(
      (total, app) =>
        total + Array.from(app.values()).reduce((parentTotal, resources) => parentTotal + resources.size, 0),
      0
    );
  }

  selectAllActions() {
    const allActionIds = this.actions().map(action => action.id);
    this.actionsChange.emit(allActionIds);
  }

  clearActions() {
    this.actionsChange.emit([]);
  }

  areAllActionsSelected() {
    return this.selectedActionIds().length === this.actions().length;
  }

  getSelectedActionsCount() {
    return this.selectedActionIds().length;
  }

  getUniqueActionsCount() {
    const uniqueActionIds = new Set(this.actions().map(action => action.id));
    return uniqueActionIds.size;
  }

  onActionsChange(selectedActionIds: string[]) {
    this.actionsChange.emit(selectedActionIds);
  }
}
