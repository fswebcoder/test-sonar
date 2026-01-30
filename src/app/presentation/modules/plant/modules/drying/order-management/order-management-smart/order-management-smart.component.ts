import { Component, OnInit, ViewChild, computed, inject, signal, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom, Observable } from 'rxjs';

import { OrderManagementDumpComponent } from '../order-management-dump/order-management-dump.component';
import { BigBagsUsecase } from '@/domain/use-cases/plant/drying/big-bags.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { PaginationService } from '@/shared/services/pagination.service';
import { ToastCustomService, PaginatedData, TPaginationParams } from '@SV-Development/utilities';
import { buildFallbackPaginationMetadata, getFallbackRowsPerPage } from '@/shared/helpers/pagination-metadata.helper';
import { IListBigBagSendingOrderParamsEntity } from '@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity';
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { ISendingOrderEntity } from '@/domain/entities/plant/drying/sending-order.entity';
import { IBigBagEntity } from '@/domain/entities/plant/drying/big-bag.entity';
import { ICreateBigBagSendingOrderParamsEntity } from '@/domain/entities/plant/drying/create-big-bag-sending-order-params.entity';
import { IListBigBagsParamsEntity } from '@/domain/entities/plant/drying/list-big-bags-params.entity';


@Component({
  selector: 'svi-bb-order-management-smart',
  templateUrl: './order-management-smart.component.html',
  imports: [OrderManagementDumpComponent]
})
export class OrderManagementSmartComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly bigBagsUsecase = inject(BigBagsUsecase);
  private readonly paginationService = inject(PaginationService);
  private readonly toast = inject(ToastCustomService);

  private readonly extraFilters = signal<Partial<IListBigBagSendingOrderParamsEntity>>({});

  private readonly ordersDataSignal = signal<PaginatedData<ISendingOrderEntity> | undefined>(undefined);
  ordersQueryData = computed(() =>
    this.processQueryData(this.ordersDataSignal())
  );
  ordersItems = computed(() => this.ordersQueryData().items ?? []);

  private readonly availableBigBagsDataSignal = signal<PaginatedData<IBigBagEntity> | undefined>(undefined);
  
  availableBigBagsQueryData = computed(() =>
    this.processQueryData(this.availableBigBagsDataSignal())
  );
  availableBigBagsItems = computed(() => this.availableBigBagsQueryData().items ?? []);
  availableBigBagsTotalRecords = computed<number>(() => {
    const data = this.availableBigBagsQueryData();
    return data.meta?.total ?? 0;
  });

  @ViewChild(OrderManagementDumpComponent) private dumpComponent?: OrderManagementDumpComponent;

  private readonly ordersQuery = injectQuery(() => ({
    queryKey: ['bbSendingOrders', this.paginationService.getPaginationParams(), this.extraFilters()],
    queryFn: () => this.fetchOrders(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    refetchOnMount: 'always'
  }));
  private readonly availableBigBagsQuery = injectQuery(() => ({
    queryKey: ['availableBigBags', this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchAvailableBigBags(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    refetchOnMount: 'always'
  }));


  ngOnInit(): void {
    this.paginationService.resetPagination();
  }

  filtersChange(params: IListBigBagSendingOrderParamsEntity) {
    this.paginationService.updatePagination({ first: 0, rows: getFallbackRowsPerPage(this.paginationService) });
    this.extraFilters.set({ ...params });

    this.ordersQuery.refetch();
  }

  ordersPageChange() {
    this.ordersQuery.refetch();
  }

  availableBigBagsPageChange() {
    this.availableBigBagsQuery.refetch();
  }

  handleOpenCreateOrderModal() {
    this.paginationService.resetPagination();
    this.availableBigBagsDataSignal.set(undefined);
    this.availableBigBagsQuery.refetch();
  }

  async createSendingOrder(selectedBigBags: IBigBagEntity[]) {
    if (!selectedBigBags.length) return;
    this.loadingService.setButtonLoading('create-sending-order-btn', true);
    try {
      const payload: ICreateBigBagSendingOrderParamsEntity = {
        bigBags: selectedBigBags
      };

      const response = await lastValueFrom(this.bigBagsUsecase.createBigBagSendingOrder(payload));
      this.toast.success(response.message || SUCCESS_OPERATION_TITLE);
      this.dumpComponent?.closeCreateOrderModal();
      this.refetchAndReset();
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.setButtonLoading('create-sending-order-btn', false);
    }
  }

  private refetchAndReset() {
    this.paginationService.resetPagination();

    this.ordersDataSignal.set(undefined);
    this.availableBigBagsDataSignal.set(undefined);

    this.ordersQuery.refetch();
    this.availableBigBagsQuery.refetch();
  }

  private async loadPaginatedData<R, T>(
    requestFn: (params: R) => Observable<{ data: PaginatedData<T> | undefined }>,
    params: R,
    targetSignal: WritableSignal<PaginatedData<T> | undefined>,
    options?: { showLoading?: boolean; updateTotals?: boolean }
  ): Promise<PaginatedData<T> | undefined> {

    if (options?.showLoading) {
      this.loadingService.startLoading('general');
    }

    try {
      const response = await lastValueFrom(requestFn(params));
      return this.handlePaginatedFetchSuccess(response.data, targetSignal, { updateTotals: options?.updateTotals });
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
      targetSignal.set(undefined);
      return undefined;
    } finally {
      if (options?.showLoading) {
        this.loadingService.stopLoading('general');
      }
    }
  }

  private async fetchOrders() {
    return this.loadPaginatedData<IListBigBagSendingOrderParamsEntity, ISendingOrderEntity>(
      (params) => this.bigBagsUsecase.getBigBagSendingOrders(params),
      this.buildOrdersQueryParams(),
      this.ordersDataSignal,
      { showLoading: true, updateTotals: true }
    );
  }

  private async fetchAvailableBigBags() {
    return this.loadPaginatedData<IListBigBagsParamsEntity, IBigBagEntity>(
      (params) => this.bigBagsUsecase.getAvailableBigBags(params),
      this.buildAvailableBigBagsParams(),
      this.availableBigBagsDataSignal,
      {showLoading: true, updateTotals: false }
    );
  }


  private buildOrdersQueryParams(): IListBigBagSendingOrderParamsEntity {
    return {
      ...this.paginationService.getPaginationParams(),
      ...this.extraFilters()
    };
  }

  private buildAvailableBigBagsParams(): IListBigBagsParamsEntity {
    return {
      ...this.paginationService.getPaginationParams()
    };
  }

  private processQueryData<T>(data: PaginatedData<T> | undefined): PaginatedData<T> {
    return data ?? {
      items: [],
      meta: buildFallbackPaginationMetadata(this.paginationService)
    };
  }

  private handlePaginatedFetchSuccess<T>(
    data: PaginatedData<T> | undefined,
    signalRef: WritableSignal<PaginatedData<T> | undefined>,
    options?: { updateTotals?: boolean }
  ): PaginatedData<T> | undefined {
    if (!data) {
      if (options?.updateTotals ?? true) {
        this.paginationService.setTotalRecords(0);
      }
      signalRef.set(undefined);
      return undefined;
    }

    const totalRecords = data.meta?.total ?? data.items.length ?? 0;
    if (options?.updateTotals ?? true) {
      this.paginationService.setTotalRecords(totalRecords);
    }

    signalRef.set(data);
    return data;
  }

  private handleQueryError(error: HttpErrorResponse) {
    if (error.status === 401) return;
    this.toast.error('Error', error.error?.message || LOAD_DATA_ERROR_TITLE);
  }
}
