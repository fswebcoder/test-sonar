import { Component, DestroyRef, computed, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TableComponent, TableAction, TableColumn } from '@/shared/components/table/table.component';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { ViewSwitcherComponent } from '@/shared/components/view-switcher/view-switcher.component';
import { PermissionDirective } from '@/core/directives';

import { PaginationService } from '@/shared/services/pagination.service';
import { IMaterialTypeEntity } from '@/domain/entities/scale/material-types/material-type.entity';
import { ICreateMaterialTypeParamsEntity } from '@/domain/entities/scale/material-types/create-material-type-params.entity';
import { IUpdateMaterialTypeParamsEntity } from '@/domain/entities/scale/material-types/update-material-type-params.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { ScaleActions } from '@scale/modules/actions.enum';
import { MaterialTypeFormComponent } from '@/presentation/modules/scale/modules/material-types/components/material-type-form/material-type-form.component';
import { MaterialTypeCardComponent } from '@/presentation/modules/scale/modules/material-types/components/material-type-card/material-type-card.component';
import { CardGridComponent } from '@/shared/components/card-grid/card-grid.component';

@Component({
  selector: 'svi-material-types-dump',
  standalone: true,
  imports: [
    TableComponent,
    PaginatorComponent,
    ButtonComponent,
    DialogComponent,
    ConfirmDialogComponent,
    CheckboxComponent,
    FormsModule,
    ReactiveFormsModule,
    FloatInputComponent,
    EmptyStateComponent,
    ViewSwitcherComponent,
    MaterialTypeFormComponent,
    MaterialTypeCardComponent,
    PermissionDirective,
    CardGridComponent
  ],
  templateUrl: './material-types-dump.component.html',
  styleUrl: './material-types-dump.component.scss'
})
export class MaterialTypesDumpComponent {
  materialTypes = input.required<IMaterialTypeEntity[]>();

  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);

  materialTypeModal = signal<boolean>(false);
  materialTypeAction = signal<'create' | 'edit' | 'view'>('create');
  withDeleted = signal<boolean>(false);
  searchControl = new FormControl<string>('', { nonNullable: true });
  viewMode = signal<'table' | 'cards'>('cards');

  onCreateMaterialType = output<ICreateMaterialTypeParamsEntity>();
  onUpdateMaterialType = output<IUpdateMaterialTypeParamsEntity>();
  onActivateMaterialType = output<string>();
  onDeactivateMaterialType = output<string>();

  materialType = signal<IMaterialTypeEntity | null>(null);

  @ViewChild(MaterialTypeFormComponent) materialTypeFormComponent!: MaterialTypeFormComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;
  readonly path = 'bascula/tipos-de-material';

  materialTypeList = computed(() => this.materialTypes());
  viewOptions = computed(() => [
    { value: 'table', label: 'Tabla', icon: 'pi pi-bars' },
    { value: 'cards', label: 'Tarjetas', icon: 'pi pi-table' }
  ]);

  ngOnInit(): void {
    this.initializeFilters();
    this.listenToSearchChanges();
  }

  columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', type: 'text' },
    {
      header: 'Estado',
      field: 'isActive',
      type: 'badge',
      badgeText: (item: boolean) => (item ? 'Activo' : 'Inactivo'),
      badgeSeverity: (item: boolean) => (item ? 'success' : 'danger')
    }
  ];

  actions: TableAction[] = [
    {
      icon: ICONS.EYE,
      action: (materialType: IMaterialTypeEntity) => this.openMaterialTypeModal('view', materialType),
      tooltip: 'Ver detalles',
  severity: EActionSeverity.VIEW,
      permission: {
        action: ScaleActions.VER_TIPOS_DE_MATERIAL,
        path: this.path
      }
    },
    {
      icon: ICONS.PENCIL,
      action: (materialType: IMaterialTypeEntity) => this.openMaterialTypeModal('edit', materialType),
      tooltip: 'Editar',
  severity: EActionSeverity.EDIT,
      permission: {
        action: ScaleActions.ACTUALIZAR_TIPO_DE_MATERIAL,
        path: this.path
      }
    },
    {
      icon: ICONS.INACTIVATE,
      action: (materialType: IMaterialTypeEntity) => this.deactivateMaterialType(materialType),
      tooltip: 'Desactivar',
  severity: EActionSeverity.DEACTIVATE,
      disabled: (materialType: IMaterialTypeEntity) => !materialType.isActive,
      permission: {
        action: ScaleActions.ELIMINAR_TIPO_DE_MATERIAL,
        path: this.path
      }
    },
    {
      icon: ICONS.ACTIVATE,
      action: (materialType: IMaterialTypeEntity) => this.activateMaterialType(materialType),
      tooltip: 'Activar',
  severity: EActionSeverity.ACTIVATE,
      disabled: (materialType: IMaterialTypeEntity) => materialType.isActive,
      permission: {
        action: ScaleActions.ACTIVAR_TIPO_DE_MATERIAL,
        path: this.path
      }
    }
  ];

  openMaterialTypeModal(action: 'create' | 'edit' | 'view', materialType?: IMaterialTypeEntity) {
    this.materialTypeModal.set(true);
    this.materialTypeAction.set(action);
    this.materialType.set(materialType ?? null);
  }

  getModalTitle(): string {
    switch (this.materialTypeAction()) {
      case 'edit':
        return 'Editar tipo de material';
      case 'view':
        return 'Detalle del tipo de material';
      default:
        return 'Registrar tipo de material';
    }
  }

  createMaterialType(materialType: ICreateMaterialTypeParamsEntity) {
    this.onCreateMaterialType.emit(materialType);
  }

  updateMaterialType(materialType: IUpdateMaterialTypeParamsEntity) {
    this.onUpdateMaterialType.emit(materialType);
  }

  closeMaterialTypeModal() {
    this.materialTypeModal.set(false);
    this.materialTypeAction.set('create');
    this.materialType.set(null);
    this.materialTypeFormComponent?.resetForm();
  }

  withDeletedChange(value: boolean) {
    this.withDeleted.set(value);
    this.paginationService.setWithDeleted(value);
    this.resetToFirstPage();
  }

  activateMaterialType(materialType: IMaterialTypeEntity) {
    this.confirmDialog.show(
      `¿Desea activar el tipo de material "${materialType.name}"?`,
      () => this.onActivateMaterialType.emit(materialType.id),
      () => {}
    );
  }

  deactivateMaterialType(materialType: IMaterialTypeEntity) {
    this.confirmDialog.show(
      `¿Desea desactivar el tipo de material "${materialType.name}"?`,
      () => this.onDeactivateMaterialType.emit(materialType.id),
      () => {}
    );
  }

  onViewModeChange(mode: string) {
    if (mode === 'table' || mode === 'cards') {
      this.viewMode.set(mode);
    }
  }

  get totalRecords(): number {
    return this.paginationService.getTotalRecords();
  }

  private initializeFilters(): void {
    const params = this.paginationService.getPaginationParams();
    this.withDeleted.set(!!params.withDeleted);
    this.paginationService.setWithDeleted(!!params.withDeleted);

    const search = params.search ?? '';
    this.searchControl.setValue(search, { emitEvent: false });
    this.paginationService.setSearch(search);
  }

  private listenToSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setSearch(value);
        this.resetToFirstPage();
      });
  }

  private resetToFirstPage(): void {
    const paginationState = this.paginationService.paginationState();
    this.paginationService.updatePagination({
      first: 0,
      rows: paginationState.rows
    });
  }
}
