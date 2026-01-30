import { Component, DestroyRef, OnInit, ViewChild, computed, inject, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { finalize, lastValueFrom, map } from "rxjs";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { OrdersDumpComponent } from "@/presentation/modules/scale/modules/orders/orders-dump/orders-dump.component";
import { OrdersUsecase } from "@/domain/use-cases/scale/orders/orders.usecase";
import { LoadingService } from "@/shared/services/loading.service";
import { ToastCustomService, PaginatedData } from "@SV-Development/utilities";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { IOrdersQueryParams } from "@/domain/entities/scale/orders/orders-query-params.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from "@/shared/constants/general.contant";
import { Store } from "@ngrx/store";
import { IStorageZonesCatalogEntity } from "@/domain/entities/common/storage-zones-catalog.entity";
import { IMaterialTypeCatalogEntity } from "@/domain/entities/common/material-type-catalog.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { SuppliersUseCase } from "@/domain/use-cases/admin/suppliers/suppliers.usecase";
import { MinesAdminUseCase } from "@/domain/use-cases/suppliers/admin/mines/mines-admin.usecase";
import { IListBatchesParamsEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-params.entity";
import { EPlantProcess } from "@/shared/enums/plant-process.enum";
import { IVehicleCatalogEntity } from "@/domain/entities/common/vehicle-catalog.entity";
import { IDriverCatalogEntity } from "@/domain/entities/common/driver-catalog.entity";
import { getDrivers, getMaterialTypes, getStorageZones, getSuppliers, getVehicles } from "@/store/selectors/common/common.selectors";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";
import { buildFallbackPaginationMetadata } from "@/shared/helpers/pagination-metadata.helper";
import { PaginationService } from "@/shared/services/pagination.service";
import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";

@Component({
  selector: "svi-orders-smart",
  imports: [OrdersDumpComponent],
  templateUrl: "./orders-smart.component.html",
  styleUrl: "./orders-smart.component.scss"
})
export class OrdersSmartComponent implements OnInit {
  private readonly ordersUsecase = inject(OrdersUsecase);
  private readonly suppliersUseCase = inject(SuppliersUseCase);
  private readonly minesUsecase = inject(MinesAdminUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  @ViewChild(OrdersDumpComponent) ordersDumpComponent!: OrdersDumpComponent;

  driversOptions = signal<IDriverCatalogEntity[]>([]);
  vehiclesOptions = signal<IVehicleCatalogEntity[]>([]);
  materialTypesOptions = signal<IMaterialTypeCatalogEntity[]>([]);
  storageZoneOptions = signal<IStorageZonesCatalogEntity[]>([]);
  suppliersOptions = signal<IsupplierListResponseEntity[]>([]);
  mineOptions = signal<IIdName[]>([]);
  batchOptions = signal<IIdName[]>([]);
  orderTypeFilter = signal<EOrderScaleType>(EOrderScaleType.RECEPTION);

  private readonly ordersQuery = injectQuery(() => ({
    queryKey: ['orders', this.paginationService.getPaginationParams(), this.orderTypeFilter()],
    queryFn: () => this.fetchOrders(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true,
    refetchOnMount: "always"
  }));

  ordersQueryData = computed(() => {
    const queryData = this.ordersQuery.data();
    return queryData ?? { items: [], meta: buildFallbackPaginationMetadata(this.paginationService) };
  });

  ngOnInit(): void {
    this.paginationService.resetPagination();
    this.loadInitialData();
  }

  createOrder(payload: ICreateOrderParamsEntity): void {
    this.loadingService.setButtonLoading('modal-order-button', true);
    this.ordersUsecase
      .create(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-order-button', false))
      )
      .subscribe({
        next: response => {
          this.ordersDumpComponent.closeOrderModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  assignBatchToOrder(payload: IAsignBatchOrderParams): void {
    if (!payload.orderId) {
      return;
    }

    this.loadingService.setButtonLoading('assign-batch-order-btn', true);
    this.ordersUsecase
      .asignBatchToOrder(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('assign-batch-order-btn', false))
      )
      .subscribe({
        next: response => {
          this.ordersDumpComponent.closeAssignBatchModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  private processResponse(response: IEmptyResponse): void {
    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
    this.ordersQuery.refetch();
  }

  private async fetchOrders(): Promise<PaginatedData<IOrderEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const { statusIds, ...paginationParams } = this.paginationService.getPaginationParams();
      const selectedStatuses = (statusIds ?? []) as EOrderScaleStatus[];
      const statusFilter = selectedStatuses.length > 0 ? selectedStatuses : [EOrderScaleStatus.PENDING, EOrderScaleStatus.CREATED];
      const selectedOperationType = this.orderTypeFilter();

      const params: IOrdersQueryParams = {
        ...paginationParams,
        status: statusFilter,
        operationType: selectedOperationType
      };

      const response = await lastValueFrom(this.ordersUsecase.getAll(params));
      if (response.data?.meta?.total !== undefined) {
        this.paginationService.setTotalRecords(response.data.meta.total);
      }
      return response.data;
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
      return undefined;
    } finally {
      this.loadingService.stopLoading('general');
    }
  }

  handleOrderTypeChange(orderType: EOrderScaleType): void {
    if (this.orderTypeFilter() === orderType) {
      return;
    }
    this.orderTypeFilter.set(orderType);
  }

  private loadInitialData(): void {
    this.store.select(getMaterialTypes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(materialTypes => this.materialTypesOptions.set(materialTypes ?? []));

    this.store.select(getStorageZones)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(storageZones => this.storageZoneOptions.set(storageZones ?? []));

    this.store.select(getSuppliers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(suppliers => this.suppliersOptions.set(suppliers ?? []));

    this.store.select(getVehicles)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(vehicles => this.vehiclesOptions.set(vehicles ?? []));

    this.store.select(getDrivers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(drivers => this.driversOptions.set(drivers ?? []));
  }

  private handleQueryError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      return;
    }
    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
  }

  async handleSupplierSelected(supplierId: string): Promise<void> {
    this.mineOptions.set([]);
    this.batchOptions.set([]);
    if (!supplierId) {
      return;
    }

    this.loadingService.startLoading('order-batches');
    try {
      const mines = await this.fetchMinesBySupplier(supplierId);
      this.mineOptions.set(mines);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('order-batches');
    }
  }

  async handleMineSelected(mineId: string): Promise<void> {
    this.batchOptions.set([]);
    if (!mineId) {
      return;
    }

    this.loadingService.startLoading('order-batches');
    try {
      const batches = await this.fetchBatchesByMine({
        mineId,
        typeOperationBatch: EPlantProcess.SCALE
      });
      this.batchOptions.set(batches);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('order-batches');
    }
  }

  private async fetchMinesBySupplier(supplierId: string): Promise<IIdName[]> {
    return lastValueFrom(
      this.minesUsecase.getMinesBySupplierId(supplierId).pipe(
        takeUntilDestroyed(this.destroyRef),
        map(response => response.data ?? [])
      )
    );
  }

  private async fetchBatchesByMine(params: IListBatchesParamsEntity): Promise<IIdName[]> {
    const batches = await lastValueFrom(
      this.suppliersUseCase.getBatches(params).pipe(
        takeUntilDestroyed(this.destroyRef),
        map(response => response.data ?? [])
      )
    );

    return batches.map(batch => ({
      id: batch.id,
      name: batch.code ?? batch.id
    }));
  }
}
