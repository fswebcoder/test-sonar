import { Component, DestroyRef, computed, inject, input, output, signal, ViewChild } from '@angular/core';
import { TableComponent, TableAction, TableColumn } from '@/shared/components/table/table.component';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationService } from '@/shared/services/pagination.service';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { ICreateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/create-vehicle-params.entity';
import { IUpdateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/update-vehicle-params.entity';
import { VehicleFormComponent } from '@/presentation/modules/scale/modules/vehicles/components/vehicle-form/vehicle-form.component';
import { IVehicleTypeEntity } from '@/domain/entities/common/vehicle-type.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { VehiclePlateDirective } from '@SV-Development/utilities';
import { ScaleActions } from '@scale/modules/actions.enum';
import { ViewSwitcherComponent } from '@/shared/components/view-switcher/view-switcher.component';
import { VehicleCardComponent } from '@/presentation/modules/scale/modules/vehicles/components/vehicle-card/vehicle-card.component';
import { CardGridComponent } from '@/shared/components/card-grid/card-grid.component';
import { VehicleDetailComponent } from '@/presentation/modules/scale/modules/vehicles/components/vehicle-detail/vehicle-detail.component';

@Component({
  selector: 'svi-vehicles-dump',
  imports: [
    TableComponent,
    PaginatorComponent,
    ButtonComponent,
    DialogComponent,
    ConfirmDialogComponent,
    CheckboxComponent,
    FormsModule,
    ReactiveFormsModule,
    VehicleFormComponent,
    FloatInputComponent,
    EmptyStateComponent,
  VehiclePlateDirective,
  ViewSwitcherComponent,
  VehicleCardComponent,
  CardGridComponent,
  VehicleDetailComponent
],
  templateUrl: './vehicles-dump.component.html',
  styleUrl: './vehicles-dump.component.scss'
})
export class VehiclesDumpComponent {
  vehicles = input.required<IVehicle[]>();
  vehicleTypes = input.required<IVehicleTypeEntity[]>();

  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);

  vehicleModal = signal<boolean>(false);
  vehicleAction = signal<'create' | 'edit' | 'view'>('create');
  selectedDocument = signal<'soat' | 'technomechanical' | 'registration' | null>(null);
  withDeleted = signal<boolean>(false);
  searchControl = new FormControl<string>('', { nonNullable: true });
  viewMode = signal<'table' | 'cards'>('cards');

  onCreateVehicle = output<ICreateVehicleParamsEntity>();
  onUpdateVehicle = output<IUpdateVehicleParamsEntity>();
  onActivateVehicle = output<string>();
  onDeactivateVehicle = output<string>();

  vehicle = signal<IVehicle | null>(null);

  @ViewChild(VehicleFormComponent) vehicleFormComponent!: VehicleFormComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;
  readonly path = "bascula/vehiculos";

  vehicleList = computed(() => this.vehicles());
  viewOptions = computed(() => [
    { value: 'table', label: 'Tabla', icon: 'pi pi-bars' },
    { value: 'cards', label: 'Tarjetas', icon: 'pi pi-table' }
  ]);

  ngOnInit(): void {
    this.initializeFilters();
    this.listenToSearchChanges();
  }

  columns: TableColumn[] = [
    { field: 'plate', header: 'Placa', type: 'text' },
    { field: 'vehicleTypeName', header: 'Tipo de vehículo', type: 'text' },
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
      action: (vehicle: IVehicle) => this.openVehicleModal('view', vehicle),
      tooltip: 'Ver detalles',
  severity: EActionSeverity.VIEW,
      permission:{
        action: ScaleActions.VER_DETALLE_VEHICULO,
        path: this.path
      }
    },
    {
      icon: ICONS.PENCIL,
      action: (vehicle: IVehicle) => this.openVehicleModal('edit', vehicle),
      tooltip: 'Editar',
  severity: EActionSeverity.EDIT,
      permission:{
        action: ScaleActions.ACTUALIZAR_VEHICULO,
        path: this.path
      }
    },
    {
      icon: ICONS.INACTIVATE,
      action: (vehicle: IVehicle) => this.deactivateVehicle(vehicle),
      tooltip: 'Desactivar',
  severity: EActionSeverity.DEACTIVATE,
      disabled: (vehicle: IVehicle) => !vehicle.isActive,
      permission:{
        action: ScaleActions.INACTIVAR_VEHICULO,
        path: this.path
      }
    },
    {
      icon: ICONS.ACTIVATE,
      action: (vehicle: IVehicle) => this.activateVehicle(vehicle),
      tooltip: 'Activar',
  severity: EActionSeverity.ACTIVATE,
      disabled: (vehicle: IVehicle) => vehicle.isActive,
      permission:{
        action: ScaleActions.ACTIVAR_VEHICULO,
        path: this.path
      }
    }
  ];

  openVehicleModal(action: 'create' | 'edit' | 'view', vehicle?: IVehicle) {
    this.vehicleModal.set(true);
    this.vehicleAction.set(action);
    this.vehicle.set(vehicle ?? null);

    if (action !== 'view') {
      this.selectedDocument.set(null);
      return;
    }

    // If not explicitly set (e.g. from table), choose a sensible default.
    if (!this.selectedDocument()) {
      const docs = vehicle?.documents;
      if (docs?.soatUrl) this.selectedDocument.set('soat');
      else if (docs?.technomechanicalUrl) this.selectedDocument.set('technomechanical');
      else this.selectedDocument.set('registration');
    }
  }

  openVehicleDocumentModal(document: 'soat' | 'technomechanical' | 'registration', vehicle: IVehicle): void {
    this.selectedDocument.set(document);
    this.openVehicleModal('view', vehicle);
  }

  onViewModeChange(mode: string) {
    if (mode === 'table' || mode === 'cards') {
      this.viewMode.set(mode);
    }
  }

  getModalTitle(): string {
    switch (this.vehicleAction()) {
      case 'edit':
        return 'Editar vehículo';
      case 'view':
        switch (this.selectedDocument()) {
          case 'technomechanical':
            return 'Detalles de Tecnomecánica';
          case 'registration':
            return 'Detalles de Tarjeta de propiedad';
          default:
            return 'Detalles de SOAT';
        }
      default:
        return 'Registrar vehículo';
    }
  }

  createVehicle(vehicle: ICreateVehicleParamsEntity) {
    this.onCreateVehicle.emit(vehicle);
  }

  updateVehicle(vehicle: IUpdateVehicleParamsEntity) {
    this.onUpdateVehicle.emit(vehicle);
  }

  closeVehicleModal() {
    this.vehicleModal.set(false);
    this.vehicleAction.set('create');
    this.selectedDocument.set(null);
    this.vehicle.set(null);
    this.vehicleFormComponent?.resetForm();
  }

  withDeletedChange(value: boolean) {
    this.withDeleted.set(value);
    this.paginationService.setWithDeleted(value);
    this.resetToFirstPage();
  }

  activateVehicle(vehicle: IVehicle) {
    this.confirmDialog.show(
      `¿Desea activar el vehículo "${vehicle.plate}"?`,
      () => this.onActivateVehicle.emit(vehicle.id),
      () => {}
    );
  }

  deactivateVehicle(vehicle: IVehicle) {
    this.confirmDialog.show(
      `¿Desea desactivar el vehículo "${vehicle.plate}"?`,
      () => this.onDeactivateVehicle.emit(vehicle.id),
      () => {}
    );
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
