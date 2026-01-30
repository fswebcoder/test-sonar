import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { IDriverCatalogEntity } from '@/domain/entities/common/driver-catalog.entity';
import { IVehicleCatalogEntity } from '@/domain/entities/common/vehicle-catalog.entity';
import { IMaterialTypeCatalogEntity } from '@/domain/entities/common/material-type-catalog.entity';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SviStepperModule } from '@/shared/components/stepper/svi-stepper.module';
import { StepGeneralInfoComponent } from '../components/step-general-info/step-general-info.component';
import { ICONS } from '@/shared/enums/general.enum';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { StepVehicleComponent } from "../components/step-vehicle/step-vehicle.component";
import { StepDriverComponent } from '../components/step-driver/step-driver.component';
import { StepObserverComponent } from '../components/step-observer/step-observer.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { VehicleFormComponent } from '@/presentation/modules/scale/modules/vehicles/components/vehicle-form/vehicle-form.component';
import { DriverFormComponent } from '@/presentation/modules/scale/modules/drivers/components/driver-form/driver-form.component';
import { ObserverFormComponent } from '@/presentation/modules/scale/modules/observers/components/observer-form/observer-form.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ICreateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/create-vehicle-params.entity';
import { IVehicleTypeEntity } from '@/domain/entities/common/vehicle-type.entity';
import { ICreateDriverParamsEntity } from '@/domain/entities/scale/drivers/create-driver-params.entity';
import { ICreateObserverParamsEntity } from '@/domain/entities/scale/observers/create-observer-params.entity';
import { StepSummaryComponent } from '../components/step-summary/step-summary.component';
import { ICreateWeighingOrderParams } from '@/domain/entities/suppliers/admin/weighing-orders/create-weighing-order-params.entity';
import { MINERAL_SEND_LOADING } from '../mineral-send.loading';
import { DriverDocumentsFormComponent } from '../components/driver-documents-form/driver-documents-form.component';
import { IUpdateDriverParamsEntity } from '@/domain/entities/scale/drivers/update-driver-params.entity';
import { VehicleDocumentsFormComponent } from '../components/vehicle-documents-form/vehicle-documents-form.component';
import { IUpdateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/update-vehicle-params.entity';
import { ObserverDocumentsFormComponent } from '../components/observer-documents-form/observer-documents-form.component';
import { IUpdateObserverParamsEntity } from '@/domain/entities/scale/observers/update-observer-params.entity';
import { OrdersListComponent } from '../components/orders-list/orders-list.component';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';
import { OrderFormComponent } from '../components/order-form/order-form.component';
import { ISupplierOrderEntity } from '@/domain/entities/suppliers/admin/weighing-orders/supplier-order.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { PaginationMetadata } from '@SV-Development/utilities';
import { ButtonComponent } from '@/shared/components/form/button/button.component';

type CrudAction = 'create' | 'edit' | 'view';
type ViewMode = 'list' | 'wizard';

@Component({
    selector: 'svi-mineral-send-dump',
    standalone: true,
    imports: [CommonModule, SviStepperModule, StepGeneralInfoComponent, StepDriverComponent, StepObserverComponent, StepVehicleComponent, StepSummaryComponent, DialogComponent, VehicleFormComponent, DriverFormComponent, ObserverFormComponent, DriverDocumentsFormComponent, VehicleDocumentsFormComponent, ObserverDocumentsFormComponent, ConfirmDialogComponent, OrdersListComponent, OrderDetailComponent, OrderFormComponent, ButtonComponent],
    templateUrl: './mineral-send-dump.component.html'
})

export class MineralSendDumpComponent {

    private readonly destroyRef = inject(DestroyRef);

    // View mode
    viewMode = input<ViewMode>('list');
    editingOrder = input<ISupplierOrderEntity | null>(null);
    
    // Orders list inputs
    orders = input<ISupplierOrderEntity[]>([]);
    ordersMeta = input<PaginationMetadata | null>(null);
    ordersLoading = input<boolean>(false);

    mines = input.required<IMineEntity[]>();
    
    // Computed para determinar si está en modo edición
    readonly isEditMode = computed(() => this.editingOrder() !== null);
    
    // Textos dinámicos según el modo
    readonly wizardTitle = computed(() => 
        this.isEditMode() ? 'Editar Orden de Envío' : 'Nueva Orden de Envío'
    );
    
    readonly finishButtonLabel = computed(() => 
        this.isEditMode() ? 'Guardar cambios' : 'Finalizar envío'
    );

    // Computed que incluye la mina de la orden editada si no está en la lista
    readonly minesWithEditingOrderMine = computed(() => {
        const mines = this.mines();
        const order = this.editingOrder();
        
        if (!order?.mine) return mines;
        
        // Verificar si la mina de la orden ya está en la lista
        const mineExists = mines.some(m => m.id === order.mine!.id);
        if (mineExists) return mines;
        
        // Agregar la mina de la orden al inicio
        return [{ id: order.mine.id, name: order.mine.name, isActive: true } as IMineEntity, ...mines];
    });
    
    materialTypes = input.required<IMaterialTypeCatalogEntity[]>();
    documentTypes = input.required<IDocumentTypeResponse[]>();
    drivers = input.required<IDriverCatalogEntity[]>();
    vehicles = input.required<IVehicleCatalogEntity[]>();
    vehicleTypes = input.required<IVehicleTypeEntity[]>();
    vehicleSearchResult = input<IVehicle | null>(null);
    driverSearchResult = input<IDriverEntity | null>(null);
    observerSearchResult = input<IObserverEntity | null>(null);
    
    // Orders list outputs
    createOrderClick = output<void>();
    backToList = output<void>();
    viewOrder = output<ISupplierOrderEntity>();
    editOrder = output<ISupplierOrderEntity>();
    cancelOrder = output<ISupplierOrderEntity>();
    pageChange = output<void>();
    searchChange = output<string>();
    statusChange = output<string | null>();

    searchVehicle = output<string>();
    searchDriver = output<string>();
    searchObserver = output<string>();
    createVehicle = output<ICreateVehicleParamsEntity>();
    createDriver = output<ICreateDriverParamsEntity>();
    updateDriverDocuments = output<Pick<IUpdateDriverParamsEntity, 'id' | 'documents'>>();
    updateVehicleDocuments = output<Pick<IUpdateVehicleParamsEntity, 'id' | 'documents'>>();
    createObserver = output<ICreateObserverParamsEntity>();
    updateObserverDocuments = output<Pick<IUpdateObserverParamsEntity, 'id' | 'documents'>>();
    clearVehicle = output<void>();
    clearDriver = output<void>();
    clearObserver = output<void>();

    confirmSend = output<ICreateWeighingOrderParams>();
    updateOrder = output<IUpdateSupplierOrderParamsEntity>();

    ICONS = ICONS

    readonly LOADING = MINERAL_SEND_LOADING;

    // Order modal
    orderModal = signal<boolean>(false);
    orderModalAction = signal<'view' | 'edit'>('view');
    selectedOrder = signal<ISupplierOrderEntity | null>(null);
    readonly minShippingDate = new Date();

    stepValue: number | undefined = 1;

    vehicleModal = signal<boolean>(false);
    vehicleAction = signal<CrudAction>('create');
    vehicle = signal<IVehicle | null>(null);

    vehicleDocumentsModal = signal<boolean>(false);
    vehicleForDocuments = signal<IVehicle | null>(null);

    driverModal = signal<boolean>(false);
    driverAction = signal<CrudAction>('create');
    driver = signal<IDriverEntity | null>(null);

    driverDocumentsModal = signal<boolean>(false);
    driverForDocuments = signal<IDriverEntity | null>(null);

    observerModal = signal<boolean>(false);
    observerAction = signal<CrudAction>('create');
    observer = signal<IObserverEntity | null>(null);

    observerDocumentsModal = signal<boolean>(false);
    observerForDocuments = signal<IObserverEntity | null>(null);

    requireObserver = signal<boolean>(false);

    @ViewChild(VehicleFormComponent) vehicleFormComponent!: VehicleFormComponent;
    @ViewChild(DriverFormComponent) driverFormComponent!: DriverFormComponent;
    @ViewChild(DriverDocumentsFormComponent) driverDocumentsFormComponent!: DriverDocumentsFormComponent;
    @ViewChild(ObserverFormComponent) observerFormComponent!: ObserverFormComponent;
    @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
    @ViewChild(VehicleDocumentsFormComponent) vehicleDocumentsFormComponent!: VehicleDocumentsFormComponent;
    @ViewChild(ObserverDocumentsFormComponent) observerDocumentsFormComponent!: ObserverDocumentsFormComponent;

    readonly form = new FormGroup({
        generalInfo: new FormGroup({
            mineId: new FormControl<string | null>(null, [Validators.required]),
            materialTypeId: new FormControl<string | null>(null, [Validators.required]),
            supplierBatchName: new FormControl<string | null>(null),
            sendedWeight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.001), Validators.max(9999999.999)]),
            estimatedShippingDateTime: new FormControl<Date | null>(null, [Validators.required]),
            internalRemissionDocument: new FormControl<File | null>(null)
        })
    });

    get generalInfoForm(): FormGroup {
        return this.form.get('generalInfo') as FormGroup;
    }

    readonly generalInfoInvalid = signal<boolean>(this.generalInfoForm.invalid);

    private readonly selectedMaterialTypeId = signal<string | null>(null);

    readonly selectedMaterialType = computed(() => {
        const materialTypeId = this.selectedMaterialTypeId();
        if (!materialTypeId) return null;
        return this.materialTypes().find(m => m.id === materialTypeId) ?? null;
    });

    readonly requiresRemissionDocument = computed(() => this.selectedMaterialType()?.requiresRemissionDocument ?? false);

    readonly steps = computed(() => {
        const lock = this.generalInfoInvalid();
        return [
            { value: 1, title: 'Información general' },
            { value: 2, title: 'Vehículo', disabled: lock },
            { value: 3, title: 'Conductor', disabled: lock },
            { value: 4, title: 'Veedor', disabled: lock || !this.requireObserver() },
            { value: 5, title: 'Resumen y envío', disabled: lock }
        ];
    });

    constructor() {
        this.generalInfoForm.statusChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.generalInfoInvalid.set(this.generalInfoForm.invalid));

        this.generalInfoForm.get('materialTypeId')?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((materialTypeId: string | null) => {
                this.selectedMaterialTypeId.set(materialTypeId);
                this.updateRemissionDocumentValidation();
            });
            
        // Pre-llenar formulario cuando editingOrder cambia
        effect(() => {
            const order = this.editingOrder();
            if (order) {
                this.generalInfoForm.patchValue({
                    mineId: order.mine?.id ?? null,
                    materialTypeId: order.materialType.id,
                    supplierBatchName: order.supplierBatchName ?? null,
                    sendedWeight: order.sendedWeight ? Number.parseFloat(order.sendedWeight) : null,
                    estimatedShippingDateTime: order.estimatedShippingDateTime 
                        ? new Date(order.estimatedShippingDateTime) 
                        : null
                });
                
                if (order.veedor) {
                    this.requireObserver.set(true);
                }
            }
        }, { allowSignalWrites: true });
    }

    private updateRemissionDocumentValidation(): void {
        const documentControl = this.generalInfoForm.get('internalRemissionDocument');
        if (!documentControl) return;

        if (this.requiresRemissionDocument()) {
            documentControl.setValidators([Validators.required]);
        } else {
            documentControl.clearValidators();
            documentControl.setValue(null);
        }
        documentControl.updateValueAndValidity();
    }

    handleSearchVehicle(plate: string): void {
        this.searchVehicle.emit(plate);
    }

    handleSearchDriver(documentNumber: string): void {
        this.searchDriver.emit(documentNumber);
    }

    handleSearchObserver(documentNumber: string): void {
        this.searchObserver.emit(documentNumber);
    }

    handleClearVehicle(): void {
        this.clearVehicle.emit();
    }

    handleClearDriver(): void {
        this.clearDriver.emit();
    }

    handleClearObserver(): void {
        this.clearObserver.emit();
    }

    setRequireObserver(value: boolean): void {
        this.requireObserver.set(!!value);
        if (!value) {
            this.clearObserver.emit();
        }
        if (!value && this.stepValue === 4) {
            this.stepValue = 5;
        }
    }

    resetStepper(): void {
        this.stepValue = 1;
        this.requireObserver.set(false);
        this.form.reset();
        this.generalInfoForm.markAsPristine();
        this.generalInfoForm.markAsUntouched();
    }

    resetForm(): void {
        this.resetStepper();
    }

    finishSend(): void {
        if (this.generalInfoForm.invalid) {
            return;
        }

        const vehicle = this.vehicleSearchResult();
        const driver = this.driverSearchResult();
        const observer = this.observerSearchResult();

        if (!vehicle || !driver) {
            return;
        }
        if (this.requireObserver() && !observer) {
            return;
        }

        const raw = this.generalInfoForm.getRawValue() as Record<string, unknown>;
        const sendedWeight = raw['sendedWeight'] as number | null;
        const estimatedShippingDateTime = raw['estimatedShippingDateTime'] as Date | null;
        if (sendedWeight == null || !estimatedShippingDateTime) {
            return;
        }
        this.confirmSend.emit({
            driverId: driver.id,
            vehicleId: vehicle.id,
            veedorId: observer?.id ?? undefined,
            materialTypeId: raw['materialTypeId'] as string,
            mineId: (raw['mineId'] as string | null) ?? undefined,
            supplierBatchName: (raw['supplierBatchName'] as string | null) ?? null,
            sendedWeight,
            estimatedShippingDateTime,
            internalRemissionDocument: (raw['internalRemissionDocument'] as File | null) ?? null
        });
    }

    confirmCreateVehicle(plate: string): void {
        const normalizedPlate = (plate || '').trim().toUpperCase();
        const label = normalizedPlate ? ` con placa "${normalizedPlate}"` : '';
        this.confirmDialog?.show(
            `No se encontró el vehículo${label}. ¿Desea crearlo?`,
            () => this.openVehicleModal('create'),
            () => {}
        );
    }

    confirmCreateDriver(documentNumber: string): void {
        const normalizedDocument = (documentNumber || '').trim();
        const label = normalizedDocument ? ` con documento "${normalizedDocument}"` : '';
        this.confirmDialog?.show(
            `No se encontró el conductor${label}. ¿Desea crearlo?`,
            () => this.openDriverModal('create'),
            () => {}
        );
    }

    confirmCreateObserver(documentNumber: string): void {
        const normalizedDocument = (documentNumber || '').trim();
        const label = normalizedDocument ? ` con documento "${normalizedDocument}"` : '';
        this.confirmDialog?.show(
            `No se encontró el veedor${label}. ¿Desea crearlo?`,
            () => this.openObserverModal('create'),
            () => {}
        );
    }

    openVehicleModal(action: CrudAction, vehicle?: IVehicle): void {
        this.vehicleModal.set(true);
        this.vehicleAction.set(action);
        this.vehicle.set(vehicle ?? null);
    }

    openDriverModal(action: CrudAction, driver?: IDriverEntity): void {
        this.driverModal.set(true);
        this.driverAction.set(action);
        this.driver.set(driver ?? null);
    }

    openDriverDocumentsModal(): void {
        const driver = this.driverSearchResult();
        if (!driver) return;
        this.driverForDocuments.set(driver);
        this.driverDocumentsModal.set(true);
    }

    closeDriverDocumentsModal(): void {
        this.driverDocumentsModal.set(false);
        this.driverForDocuments.set(null);
        this.driverDocumentsFormComponent?.resetForm();
    }

    openObserverModal(action: CrudAction, observer?: IObserverEntity): void {
        this.observerModal.set(true);
        this.observerAction.set(action);
        this.observer.set(observer ?? null);
    }

    closeVehicleModal(): void {
        this.vehicleModal.set(false);
        this.vehicleAction.set('create');
        this.vehicle.set(null);
        this.vehicleFormComponent?.resetForm();
    }

    closeDriverModal(): void {
        this.driverModal.set(false);
        this.driverAction.set('create');
        this.driver.set(null);
        this.driverFormComponent?.resetForm();
    }

    handleUpdateDriverDocuments(payload: Pick<IUpdateDriverParamsEntity, 'id' | 'documents'>): void {
        this.updateDriverDocuments.emit(payload);
    }

    closeObserverModal(): void {
        this.observerModal.set(false);
        this.observerAction.set('create');
        this.observer.set(null);
        this.observerFormComponent?.resetForm();
    }

    getModalTitle(): string {
        switch (this.vehicleAction()) {
            case 'edit':
                return 'Editar vehículo';
            case 'view':
                return 'Detalles del vehículo';
            default:
                return 'Registrar vehículo';
        }
    }

    getDriverModalTitle(): string {
        switch (this.driverAction()) {
            case 'edit':
                return 'Editar conductor';
            case 'view':
                return 'Detalles del conductor';
            default:
                return 'Registrar conductor';
        }
    }

    getObserverModalTitle(): string {
        switch (this.observerAction()) {
            case 'edit':
                return 'Editar veedor';
            case 'view':
                return 'Detalles del veedor';
            default:
                return 'Registrar veedor';
        }
    }

    handleCreateVehicle(vehicle: ICreateVehicleParamsEntity): void {
        this.createVehicle.emit(vehicle);
    }

    handleCreateDriver(driver: ICreateDriverParamsEntity): void {
        this.createDriver.emit(driver);
    }

    handleCreateObserver(observer: ICreateObserverParamsEntity): void {
        this.createObserver.emit(observer);
    }

    openVehicleDocumentsModal(): void {
        const vehicle = this.vehicleSearchResult();
        if (!vehicle) return;
        this.vehicleForDocuments.set(vehicle);
        this.vehicleDocumentsModal.set(true);
    }

    closeVehicleDocumentsModal(): void {
        this.vehicleDocumentsModal.set(false);
        this.vehicleForDocuments.set(null);
        this.vehicleDocumentsFormComponent?.resetForm();
    }

    handleUpdateVehicleDocuments(payload: Pick<IUpdateVehicleParamsEntity, 'id' | 'documents'>): void {
        this.updateVehicleDocuments.emit(payload);
    }

    openObserverDocumentsModal(): void {
        const observer = this.observerSearchResult();
        if (!observer) return;
        this.observerForDocuments.set(observer);
        this.observerDocumentsModal.set(true);
    }

    closeObserverDocumentsModal(): void {
        this.observerDocumentsModal.set(false);
        this.observerForDocuments.set(null);
        this.observerDocumentsFormComponent?.resetForm();
    }

    handleUpdateObserverDocuments(payload: Pick<IUpdateObserverParamsEntity, 'id' | 'documents'>): void {
        this.updateObserverDocuments.emit(payload);
    }

    confirmCancelOrder(order: ISupplierOrderEntity): void {
        this.confirmDialog?.show(
            `¿Está seguro que desea cancelar la orden "${order.consecutive}"?`,
            () => this.cancelOrder.emit(order),
            () => {}
        );
    }

    // Order modal methods
    openOrderModal(action: 'view' | 'edit', order: ISupplierOrderEntity): void {
        this.orderModalAction.set(action);
        this.selectedOrder.set(order);
        this.orderModal.set(true);
    }

    closeOrderModal(): void {
        this.orderModal.set(false);
        this.orderModalAction.set('view');
        this.selectedOrder.set(null);
    }

    getOrderModalTitle(): string {
        return this.orderModalAction() === 'view' ? 'Detalle de Orden' : 'Editar Orden';
    }

    handleUpdateOrder(params: IUpdateSupplierOrderParamsEntity): void {
        this.updateOrder.emit(params);
    }
}