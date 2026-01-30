import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { catchError, finalize, lastValueFrom, map, of, tap } from "rxjs";

import { MaterialReceptionsDumpComponent } from "@/presentation/modules/scale/modules/weight-register/material-receptions/material-receptions-dump/material-receptions-dump.component";
import { OrdersUsecase } from "@/domain/use-cases/scale/orders/orders.usecase";
import { PaginationService } from "@/shared/services/pagination.service";
import { LoadingService } from "@/shared/services/loading.service";
import { ToastCustomService, PaginatedData } from "@SV-Development/utilities";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { IOrdersQueryParams } from "@/domain/entities/scale/orders/orders-query-params.entity";
import { ERROR_OPERATION_TITLE, LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from "@/shared/constants/general.contant";
import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { WeightRegisterUsecase } from "@/domain/use-cases/scale/weight-register/weight-register.usecase";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";
import { buildFallbackPaginationMetadata } from "@/shared/helpers/pagination-metadata.helper";
import { Store } from "@ngrx/store";
import { getStorageZones } from "@/store/selectors/common/common.selectors";
import { IIdName } from "@/shared/interfaces/id-name.interface";

@Component({
  selector: "svi-material-receptions-smart",
  imports: [MaterialReceptionsDumpComponent],
  templateUrl: "./material-receptions-smart.component.html",
  styleUrl: "./material-receptions-smart.component.scss"
})
export class MaterialReceptionsSmartComponent implements OnInit {
  private readonly ordersUsecase = inject(OrdersUsecase);
  private readonly paginationService = inject(PaginationService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly weightRegisterUsecase = inject(WeightRegisterUsecase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  storageZonesOptions = signal<IIdName[]>([]);

  private readonly materialReceptionsQuery = injectQuery(() => ({
    queryKey: ["material-receptions", this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchMaterialReceptions(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true,
    refetchOnMount: "always",
  }));

  materialReceptionsQueryData = computed(() => {
    const queryData = this.materialReceptionsQuery.data();
    return queryData ?? { items: [], meta: buildFallbackPaginationMetadata(this.paginationService) };
  });

  ngOnInit(): void {
    this.paginationService.resetPagination();
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.store
      .select(getStorageZones)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(zones => (zones ?? []).map(z => ({ id: z.id, name: z.name })))
      )
      .subscribe(zones => this.storageZonesOptions.set(zones));
  }

  onAddWeight(order: IOrderEntity): void {
    this.toastCustomService.info(
      `Se abrira el modal para agregar peso al consecutivo ${order.consecutive} en una iteracion posterior.`
    );
  }

  registerWeight(params: IWeightRegisterParams): void {
    this.loadingService.startLoading("general");
    this.weightRegisterUsecase.receptionWeight(params).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((res:IEmptyResponse) => this.processResponse(res)),
      catchError((error: HttpErrorResponse) => {
        this.toastCustomService.error(error.error?.message || ERROR_OPERATION_TITLE);
        return of();
      }),
      finalize(() => this.loadingService.stopLoading("general"))
    ).subscribe();
  }

  private async fetchMaterialReceptions(): Promise<PaginatedData<IOrderEntity> | undefined> {
    this.loadingService.startLoading("general");
    try {
      const { statusIds, ...paginationParams } = this.paginationService.getPaginationParams();
      const selectedStatuses = (statusIds ?? []) as EOrderScaleStatus[];
      const statusFilter = selectedStatuses.length > 0 ? selectedStatuses : [EOrderScaleStatus.PENDING];

      const params: IOrdersQueryParams = {
        ...paginationParams,
        status: statusFilter,
        operationType: EOrderScaleType.RECEPTION
      };

      const response = await lastValueFrom(this.ordersUsecase.getReceptions(params));
      if (response.data?.meta?.total !== undefined) {
        this.paginationService.setTotalRecords(response.data.meta.total);
      }
      return response.data;
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
      return undefined;
    } finally {
      this.loadingService.stopLoading("general");
    }
  }


  private processResponse(response: IEmptyResponse) {
    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
    this.materialReceptionsQuery.refetch();
  }

  private handleQueryError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      return;
    }
    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
  }
}
