import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { IMaterialTypeCatalogEntity } from '@/domain/entities/common/material-type-catalog.entity';
import { getDrivers, getMaterialTypes, getVehicles, getVehicleTypes, selectCommonDocumentTypes } from '@/store/selectors/common/common.selectors';
import { Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MineralSendDumpComponent } from "../mineral-send-dump/mineral-send-dump.component";
import { PaginationMetadata, ToastCustomService } from '@SV-Development/utilities';
import { LoadingService } from '@/shared/services/loading.service';
import { IDriverCatalogEntity } from '@/domain/entities/common/driver-catalog.entity';
import { IVehicleCatalogEntity } from '@/domain/entities/common/vehicle-catalog.entity';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { VehiclesUsecase } from '@/domain/use-cases/scale/vehicles/vehicles.usecase';
import { DriversUsecase } from '@/domain/use-cases/scale/drivers/drivers.usecase';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ICreateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/create-vehicle-params.entity';
import { IVehicleTypeEntity } from '@/domain/entities/common/vehicle-type.entity';
import { getDriversAction, getVehiclesAction } from '@/store/actions/common/common.action';
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { ICreateDriverParamsEntity } from '@/domain/entities/scale/drivers/create-driver-params.entity';
import { IUpdateDriverParamsEntity } from '@/domain/entities/scale/drivers/update-driver-params.entity';
import { ObserversUsecase } from '@/domain/use-cases/scale/observers/observers.usecase';
import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { ICreateObserverParamsEntity } from '@/domain/entities/scale/observers/create-observer-params.entity';
import { MINERAL_SEND_LOADING } from '../mineral-send.loading';
import { ICreateWeighingOrderParams } from '@/domain/entities/suppliers/admin/weighing-orders/create-weighing-order-params.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { WeighingOrdersUsecase } from '@/domain/use-cases/suppliers/admin/weighing-orders/weighing-orders.usecase';
import { MinesAdminUseCase } from '@/domain/use-cases/suppliers/admin/mines/mines-admin.usecase';
import { IUpdateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/update-vehicle-params.entity';
import { IUpdateObserverParamsEntity } from '@/domain/entities/scale/observers/update-observer-params.entity';
import { ISupplierOrderEntity } from '@/domain/entities/suppliers/admin/weighing-orders/supplier-order.entity';
import { PaginationService } from '@/shared/services/pagination.service';

type ViewMode = 'list' | 'wizard';

@Component({
    selector: 'svi-mineral-send-smart',
    templateUrl: 'mineral-send-smart.component.html',
    imports: [MineralSendDumpComponent]
})

export class MineralSendSmartComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);
    private readonly store = inject(Store);
    private readonly paginationService = inject(PaginationService);
    private readonly minesUsecase = inject(MinesAdminUseCase);
    private readonly vehiclesUsecase = inject(VehiclesUsecase);
    private readonly driversUsecase = inject(DriversUsecase);
    private readonly observersUsecase = inject(ObserversUsecase);
    private readonly weighingOrdersUsecase = inject(WeighingOrdersUsecase);
    private readonly toastCustomService = inject(ToastCustomService);
    private readonly loadingService = inject(LoadingService);

    @ViewChild(MineralSendDumpComponent) mineralSendDumpComponent!: MineralSendDumpComponent;
    
    localUser = localStorage.getItem('app-state');

    activeCompany = computed(() => this.localUser ? JSON.parse(this.localUser).activeCompany : null);
    tenantSupplierId = computed(() => this.activeCompany() ? this.activeCompany().tenantSupplierId : null);

    // View mode
    viewMode = signal<ViewMode>('list');
    editingOrder = signal<ISupplierOrderEntity | null>(null);

    // Orders list
    orders = signal<ISupplierOrderEntity[]>([]);
    ordersMeta = signal<PaginationMetadata | null>(null);
    ordersLoading = signal<boolean>(false);
    ordersSearch = signal<string>('');
    ordersStatus = signal<string | null>(null);

    mines = signal<IMineEntity[]>([]);
    materialTypes = signal<IMaterialTypeCatalogEntity[]>([]);
    documentTypes = signal<IDocumentTypeResponse[]>([])
    drivers = signal<IDriverCatalogEntity[]>([]);
    vehicles = signal<IVehicleCatalogEntity[]>([]);
    vehicleTypes = signal<IVehicleTypeEntity[]>([]);

    vehicleSearchResult = signal<IVehicle | null>(null);
    driverSearchResult = signal<IDriverEntity | null>(null);
    observerSearchResult = signal<IObserverEntity | null>(null);

    readonly LOADING = MINERAL_SEND_LOADING;

    ngOnInit() {
        this.paginationService.resetPagination();
        this.loadInitialData();
        this.fetchMines();
        this.fetchOrders();
    }

    // ==================== Orders List Methods ====================

    fetchOrders(): void {
        this.loadingService.startLoading(this.LOADING.sections.ordersList);
        this.ordersLoading.set(true);

        const paginationParams = this.paginationService.getPaginationParams();
        const params = {
            page: paginationParams.page,
            limit: paginationParams.limit,
            search: paginationParams.search || undefined,
            status: this.ordersStatus() || undefined
        };

        this.weighingOrdersUsecase.listSupplierOrders(params)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.sections.ordersList);
                    this.ordersLoading.set(false);
                })
            )
            .subscribe({
                next: response => {
                    this.orders.set(response.data.items);
                    this.ordersMeta.set(response.data.meta);
                    this.paginationService.setTotalRecords(response.data.meta.total);
                },
                error: (error: HttpErrorResponse) => {
                    this.toastCustomService.error(
                        LOAD_DATA_ERROR_TITLE,
                        error.error?.message || 'Error al cargar las órdenes'
                    );
                }
            });
    }

    onPageChange(): void {
        this.fetchOrders();
    }

    onSearchChange(search: string): void {
        this.ordersSearch.set(search);
        this.fetchOrders();
    }

    onStatusChange(status: string | null): void {
        this.ordersStatus.set(status);
        this.paginationService.resetPagination();
        this.fetchOrders();
    }

    onCancelOrder(order: ISupplierOrderEntity): void {
        this.loadingService.startLoading(this.LOADING.sections.ordersList);
        this.weighingOrdersUsecase.cancelSupplierOrder(order.id)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.sections.ordersList);
                })
            )
            .subscribe({
                next: () => {
                    this.toastCustomService.success(
                        SUCCESS_OPERATION_TITLE,
                        'Orden cancelada correctamente'
                    );
                    this.fetchOrders();
                },
                error: (error: HttpErrorResponse) => {
                    this.toastCustomService.error(
                        'Error',
                        error.error?.message || 'Error al cancelar la orden'
                    );
                }
            });
    }

    onUpdateOrder(params: IUpdateSupplierOrderParamsEntity): void {
        this.loadingService.startLoading(this.LOADING.buttons.confirmSend);
        this.weighingOrdersUsecase.updateSupplierOrder(params)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.buttons.confirmSend);
                })
            )
            .subscribe({
                next: () => {
                    this.toastCustomService.success(
                        SUCCESS_OPERATION_TITLE,
                        'Orden actualizada correctamente'
                    );
                    this.mineralSendDumpComponent?.closeOrderModal();
                    this.fetchOrders();
                },
                error: (error: HttpErrorResponse) => {
                    this.toastCustomService.error(
                        'Error',
                        error.error?.message || 'Error al actualizar la orden'
                    );
                }
            });
    }

    onCreateOrderClick(): void {
        this.editingOrder.set(null);
        this.viewMode.set('wizard');
    }
    
    onEditOrder(order: ISupplierOrderEntity): void {
        this.editingOrder.set(order);
        this.viewMode.set('wizard');
        
        // Buscar vehículo y conductor de la orden
        this.searchVehicle(order.vehicle.plate);
        this.searchDriver(order.driver.documentNumber);
    }

    onBackToList(): void {
        this.viewMode.set('list');
        this.resetWizardState();
        this.paginationService.resetPagination();
        this.ordersSearch.set('');
        this.ordersStatus.set(null);
        this.fetchOrders();
    }

    private resetWizardState(): void {
        this.editingOrder.set(null);
        this.vehicleSearchResult.set(null);
        this.driverSearchResult.set(null);
        this.observerSearchResult.set(null);
        if (this.mineralSendDumpComponent) {
            this.mineralSendDumpComponent.resetForm();
        }
    }

    // ==================== Existing Methods ====================

    searchVehicle(plate: string): void {
        if (!plate) {
            return;
        }

        this.loadingService.startLoading(this.LOADING.sections.vehicleSearch);
        this.loadingService.setButtonLoading(this.LOADING.buttons.vehicleCreate, true);
        this.loadingService.setButtonLoading(this.LOADING.buttons.vehicleDeselect, true);

        this.vehiclesUsecase
            .getByPlate(plate)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.sections.vehicleSearch);
                    this.loadingService.setButtonLoading(this.LOADING.buttons.vehicleCreate, false);
                    this.loadingService.setButtonLoading(this.LOADING.buttons.vehicleDeselect, false);
                })
            )
            .subscribe({
                next: response => {
                    const vehicle = response.data;
                    this.vehicleSearchResult.set(vehicle);

                    if (!vehicle) {
                        this.mineralSendDumpComponent?.confirmCreateVehicle(plate);
                    }
                },
                error: () => {
                    this.vehicleSearchResult.set(null);
                    this.mineralSendDumpComponent?.confirmCreateVehicle(plate);
                }
            });
    }

    createVehicle(vehicle: ICreateVehicleParamsEntity): void {
        this.loadingService.setButtonLoading('modal-vehicle-button', true);
        this.vehiclesUsecase
            .createVehicleForSupplier(vehicle)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loadingService.setButtonLoading('modal-vehicle-button', false))
            )
            .subscribe({
                next: response => {
                    this.mineralSendDumpComponent?.closeVehicleModal();
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.store.dispatch(getVehiclesAction());
                    this.searchVehicle(vehicle.plate);
                },
                error: (error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                }
            });
    }

    clearVehicle(): void {
        this.vehicleSearchResult.set(null);
    }

    updateVehicleDocuments(params: Pick<IUpdateVehicleParamsEntity, 'id' | 'documents'>): void {
        const currentVehicle = this.vehicleSearchResult();
        const plate = currentVehicle?.plate;

        this.loadingService.setButtonLoading(this.LOADING.buttons.vehicleDocumentsUpdate, true);

        this.vehiclesUsecase
            .update({
                id: params.id,
                documents: params.documents
            } as IUpdateVehicleParamsEntity)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((response) => {
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.mineralSendDumpComponent?.closeVehicleDocumentsModal();

                    if (plate) {
                        this.searchVehicle(plate);
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                    return EMPTY;
                }),
                finalize(() => {
                    this.loadingService.setButtonLoading(this.LOADING.buttons.vehicleDocumentsUpdate, false);
                })
            )
            .subscribe();
    }

    searchDriver(documentNumber: string): void {
        if (!documentNumber) {
            return;
        }

        this.loadingService.startLoading(this.LOADING.sections.driverSearch);
        this.loadingService.setButtonLoading(this.LOADING.buttons.driverCreate, true);
        this.loadingService.setButtonLoading(this.LOADING.buttons.driverDeselect, true);

        this.driversUsecase
            .getByDocumentNumber(documentNumber)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.sections.driverSearch);
                    this.loadingService.setButtonLoading(this.LOADING.buttons.driverCreate, false);
                    this.loadingService.setButtonLoading(this.LOADING.buttons.driverDeselect, false);
                })
            )
            .subscribe({
                next: response => {
                    const driver = response.data;
                    this.driverSearchResult.set(driver);

                    if (!driver) {
                        this.mineralSendDumpComponent?.confirmCreateDriver(documentNumber);
                    }
                },
                error: () => {
                    this.driverSearchResult.set(null);
                    this.mineralSendDumpComponent?.confirmCreateDriver(documentNumber);
                }
            });
    }

    createDriver(driver: ICreateDriverParamsEntity): void {
        this.loadingService.setButtonLoading('modal-driver-button', true);
        this.driversUsecase
            .createDriverForSupplier(driver)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loadingService.setButtonLoading('modal-driver-button', false))
            )
            .subscribe({
                next: response => {
                    this.mineralSendDumpComponent?.closeDriverModal();
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.store.dispatch(getDriversAction());
                    this.searchDriver(driver.documentNumber);
                },
                error: (error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                }
            });
    }

    clearDriver(): void {
        this.driverSearchResult.set(null);
    }

    updateDriverDocuments(params: Pick<IUpdateDriverParamsEntity, 'id' | 'documents'>): void {
        const currentDriver = this.driverSearchResult();
        const documentNumber = currentDriver?.documentNumber;

        this.loadingService.setButtonLoading(this.LOADING.buttons.driverDocumentsUpdate, true);

        this.driversUsecase
            .update({
                id: params.id,
                documents: params.documents
            })
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((response) => {
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.mineralSendDumpComponent?.closeDriverDocumentsModal();

                    if (documentNumber) {
                        this.searchDriver(documentNumber);
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                    return EMPTY;
                }),
                finalize(() => {
                    this.loadingService.setButtonLoading(this.LOADING.buttons.driverDocumentsUpdate, false);
                })
            )
            .subscribe();
    }

    searchObserver(documentNumber: string): void {
        if (!documentNumber) {
            return;
        }

        this.loadingService.startLoading(this.LOADING.sections.observerSearch);
        this.loadingService.setButtonLoading(this.LOADING.buttons.observerCreate, true);
        this.loadingService.setButtonLoading(this.LOADING.buttons.observerDeselect, true);

        this.observersUsecase
            .getByDocumentNumber(documentNumber)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.sections.observerSearch);
                    this.loadingService.setButtonLoading(this.LOADING.buttons.observerCreate, false);
                    this.loadingService.setButtonLoading(this.LOADING.buttons.observerDeselect, false);
                })
            )
            .subscribe({
                next: response => {
                    const observer = response.data;
                    this.observerSearchResult.set(observer);

                    if (!observer) {
                        this.mineralSendDumpComponent?.confirmCreateObserver(documentNumber);
                    }
                },
                error: () => {
                    this.observerSearchResult.set(null);
                    this.mineralSendDumpComponent?.confirmCreateObserver(documentNumber);
                }
            });
    }

    createObserver(observer: ICreateObserverParamsEntity): void {
        this.loadingService.setButtonLoading('modal-observer-button', true);
        this.observersUsecase
            .createObserverForSupplier(observer)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loadingService.setButtonLoading('modal-observer-button', false))
            )
            .subscribe({
                next: response => {
                    this.mineralSendDumpComponent?.closeObserverModal();
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.searchObserver(observer.documentNumber);
                },
                error: (error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                }
            });
    }

    clearObserver(): void {
        this.observerSearchResult.set(null);
    }

    updateObserverDocuments(params: Pick<IUpdateObserverParamsEntity, 'id' | 'documents'>): void {
        const currentObserver = this.observerSearchResult();
        const documentNumber = currentObserver?.documentNumber;

        this.loadingService.setButtonLoading(this.LOADING.buttons.observerDocumentsUpdate, true);

        this.observersUsecase
            .update({
                id: params.id,
                documents: params.documents
            })
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((response) => {
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.mineralSendDumpComponent?.closeObserverDocumentsModal();

                    if (documentNumber) {
                        this.searchObserver(documentNumber);
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                    return EMPTY;
                }),
                finalize(() => {
                    this.loadingService.setButtonLoading(this.LOADING.buttons.observerDocumentsUpdate, false);
                })
            )
            .subscribe();
    }

    finishSend(payload: ICreateWeighingOrderParams): void {

        this.loadingService.setButtonLoading(this.LOADING.buttons.confirmSend, true);
        this.weighingOrdersUsecase
            .weightRegisterSupplier(payload)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((response) => {
                    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
                    this.clearVehicle();
                    this.clearDriver();
                    this.clearObserver();
                    this.mineralSendDumpComponent?.resetStepper();
                }),
                catchError((error: HttpErrorResponse) => {
                    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
                    return EMPTY;
                }),
                finalize(() => {
                    this.loadingService.setButtonLoading(this.LOADING.buttons.confirmSend, false);
                })
            )
            .subscribe();
    }

    private loadInitialData(): void {

        this.store.select(selectCommonDocumentTypes).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(this.documentTypes.set);

        this.store.select(getMaterialTypes).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(this.materialTypes.set);

        this.store.select(getDrivers).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(this.drivers.set);

        this.store.select(getVehicles).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(this.vehicles.set);

        this.store
            .select(getVehicleTypes)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(this.vehicleTypes.set);
    }

    private fetchMines(): void {
        if (!this.tenantSupplierId()) {
            return;
        }

        this.loadingService.startLoading(this.LOADING.sections.mines);
        this.minesUsecase
            .getMinesBySupplierId(this.tenantSupplierId())
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loadingService.stopLoading(this.LOADING.sections.mines))
            )
            .subscribe(response => {
                this.mines.set(response.data);
            });
    }
}