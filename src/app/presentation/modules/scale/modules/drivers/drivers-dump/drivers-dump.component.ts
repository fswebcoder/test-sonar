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

import { PaginationService } from '@/shared/services/pagination.service';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { ICreateDriverParamsEntity } from '@/domain/entities/scale/drivers/create-driver-params.entity';
import { IUpdateDriverParamsEntity } from '@/domain/entities/scale/drivers/update-driver-params.entity';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { ScaleActions } from '@scale/modules/actions.enum';
import { DriverFormComponent } from '@/presentation/modules/scale/modules/drivers/components/driver-form/driver-form.component';
import { DriverDetailComponent } from '@/presentation/modules/scale/modules/drivers/components/driver-detail/driver-detail.component';
import { DriverCardComponent } from '@/presentation/modules/scale/modules/drivers/components/driver-card/driver-card.component';
import { PermissionDirective } from '@/core/directives';
import { CardGridComponent } from "@/shared/components/card-grid/card-grid.component";

@Component({
  selector: 'svi-drivers-dump',
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
    DriverFormComponent,
    DriverDetailComponent,
    DriverCardComponent,
    PermissionDirective,
    CardGridComponent
],
  templateUrl: './drivers-dump.component.html',
  styleUrl: './drivers-dump.component.scss'
})
export class DriversDumpComponent {
  drivers = input.required<IDriverEntity[]>();
  documentTypes = input.required<IDocumentTypeResponse[]>();

  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);

  driverModal = signal<boolean>(false);
  driverAction = signal<'create' | 'edit' | 'view'>('create');
  selectedDocument = signal<'cc' | 'arl' | null>(null);
  withDeleted = signal<boolean>(false);
  searchControl = new FormControl<string>('', { nonNullable: true });
  viewMode = signal<'table' | 'cards'>('cards');

  onCreateDriver = output<ICreateDriverParamsEntity>();
  onUpdateDriver = output<IUpdateDriverParamsEntity>();
  onActivateDriver = output<string>();
  onDeactivateDriver = output<string>();

  driver = signal<IDriverEntity | null>(null);

  @ViewChild(DriverFormComponent) driverFormComponent!: DriverFormComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;
  readonly path = 'bascula/conductores';

  driverList = computed(() => this.drivers());
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
    { field: 'documentNumber', header: 'Documento', type: 'text' },
    {
      header: 'Estado',
      field: 'isActive',
      type: 'badge',
      badgeText: (item: boolean) => (item ? 'Activo' : 'Inactivo'),
      badgeColor: (item: boolean) => (item ? '#10B981' : '#ef4444'),
      badgeSeverity: (item: boolean) => (item ? 'success' : 'danger')
    }
  ];

  actions: TableAction[] = [
    {
      icon: ICONS.EYE,
      action: (driver: IDriverEntity) => this.openDriverModal('view', driver),
      tooltip: 'Ver detalles',
  severity: EActionSeverity.VIEW,
      permission: {
        action: ScaleActions.VER_DETALLE_CONDUCTOR,
        path: this.path
      }
    },
    {
      icon: ICONS.PENCIL,
      action: (driver: IDriverEntity) => this.openDriverModal('edit', driver),
      tooltip: 'Editar',
  severity: EActionSeverity.EDIT,
      permission: {
        action: ScaleActions.ACTUALIZAR_CONDUCTOR,
        path: this.path
      }
    },
    {
      icon: ICONS.INACTIVATE,
      action: (driver: IDriverEntity) => this.deactivateDriver(driver),
      tooltip: 'Desactivar',
  severity: EActionSeverity.DEACTIVATE,
      disabled: (driver: IDriverEntity) => !driver.isActive,
      permission: {
        action: ScaleActions.INACTIVAR_CONDUCTOR,
        path: this.path
      }
    },
    {
      icon: ICONS.ACTIVATE,
      action: (driver: IDriverEntity) => this.activateDriver(driver),
      tooltip: 'Activar',
  severity: EActionSeverity.ACTIVATE,
      disabled: (driver: IDriverEntity) => driver.isActive,
      permission: {
        action: ScaleActions.ACTIVAR_CONDUCTOR,
        path: this.path
      }
    }
  ];

  openDriverModal(action: 'create' | 'edit' | 'view', driver?: IDriverEntity) {
    this.driverModal.set(true);
    this.driverAction.set(action);
    this.driver.set(driver ?? null);

    if (action !== 'view') {
      this.selectedDocument.set(null);
      return;
    }

    if (!this.selectedDocument()) {
      const hasCc = !!driver?.documents?.ccUrl;
      this.selectedDocument.set(hasCc ? 'cc' : 'arl');
    }
  }

  openDriverDocumentModal(document: 'cc' | 'arl', driver: IDriverEntity): void {
    this.selectedDocument.set(document);
    this.openDriverModal('view', driver);
  }

  getModalTitle(): string {
    switch (this.driverAction()) {
      case 'edit':
        return 'Editar conductor';
      case 'view':
        return this.selectedDocument() === 'arl' ? 'Detalles de ARL' : 'Detalles de Cédula';
      default:
        return 'Registrar conductor';
    }
  }

  createDriver(driver: ICreateDriverParamsEntity) {
    this.onCreateDriver.emit(driver);
  }

  updateDriver(driver: IUpdateDriverParamsEntity) {
    this.onUpdateDriver.emit(driver);
  }

  closeDriverModal() {
    this.driverModal.set(false);
    this.driverAction.set('create');
    this.selectedDocument.set(null);
    this.driver.set(null);
    this.driverFormComponent?.resetForm();
  }

  withDeletedChange(value: boolean) {
    this.withDeleted.set(value);
    this.paginationService.setWithDeleted(value);
    this.resetToFirstPage();
  }

  activateDriver(driver: IDriverEntity) {
    this.confirmDialog.show(
      `¿Desea activar al conductor "${driver.name}"?`,
      () => this.onActivateDriver.emit(driver.id),
      () => {}
    );
  }

  deactivateDriver(driver: IDriverEntity) {
    this.confirmDialog.show(
      `¿Desea desactivar al conductor "${driver.name}"?`,
      () => this.onDeactivateDriver.emit(driver.id),
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
