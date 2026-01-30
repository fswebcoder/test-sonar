import { Component, DestroyRef, computed, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { finalize, lastValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { VehiclesDumpComponent } from '@/presentation/modules/scale/modules/vehicles/vehicles-dump/vehicles-dump.component';
import { VehiclesUsecase } from '@/domain/use-cases/scale/vehicles/vehicles.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { ICreateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/create-vehicle-params.entity';
import { IUpdateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/update-vehicle-params.entity';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { PaginatedData } from '@SV-Development/utilities';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { getVehicleTypes } from '@/store/selectors/common/common.selectors';
import { IVehicleTypeEntity } from '@/domain/entities/common/vehicle-type.entity';
import { getVehiclesAction, getVehicleTypesAction } from '@/store/actions/common/common.action';
import { buildFallbackPaginationMetadata } from '@/shared/helpers/pagination-metadata.helper';

@Component({
  selector: 'svi-vehicles-smart',
  imports: [VehiclesDumpComponent],
  templateUrl: './vehicles-smart.component.html',
  styleUrl: './vehicles-smart.component.scss'
})
export class VehiclesSmartComponent {
  private readonly vehiclesUsecase = inject(VehiclesUsecase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  @ViewChild(VehiclesDumpComponent) vehiclesDumpComponent!: VehiclesDumpComponent;

  vehicleTypes = signal<IVehicleTypeEntity[]>([]);

  ngOnInit(): void {
    this.paginationService.resetPagination();
    this.observeVehicleTypes();
  }

  private readonly vehiclesQuery = injectQuery(() => ({
    queryKey: ['vehicles', this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchVehicles(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true
  }));

  vehiclesQueryData = computed(() => {
    const queryData = this.vehiclesQuery.data();
    return this.processVehiclesQueryData(queryData);
  });

  createVehicle(vehicle: ICreateVehicleParamsEntity) {
    this.loadingService.setButtonLoading('modal-vehicle-button', true);
    this.vehiclesUsecase
      .create(vehicle)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-vehicle-button', false))
      )
      .subscribe({
        next: response => {
          this.vehiclesDumpComponent.closeVehicleModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  updateVehicle(vehicle: IUpdateVehicleParamsEntity) {
    this.loadingService.setButtonLoading('modal-vehicle-button', true);
    this.vehiclesUsecase
      .update(vehicle)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-vehicle-button', false))
      )
      .subscribe({
        next: response => {
          this.vehiclesDumpComponent.closeVehicleModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  activateVehicle(id: string) {
    this.loadingService.setButtonLoading('modal-vehicle-button', true);
    this.vehiclesUsecase.activate(id).pipe(finalize(() => this.loadingService.setButtonLoading('modal-vehicle-button', false))).subscribe({
      next: response => this.processResponse(response),
      error: (error: HttpErrorResponse) => this.handleQueryError(error)
    });
  }

  deactivateVehicle(id: string) {
    this.loadingService.setButtonLoading('modal-vehicle-button', true);
    this.vehiclesUsecase.desactivate(id).pipe(finalize(() => this.loadingService.setButtonLoading('modal-vehicle-button', false))).subscribe({
      next: response => this.processResponse(response),
      error: (error: HttpErrorResponse) => this.handleQueryError(error)
    });
  }

  private refreshStore() {
    this.store.dispatch(getVehiclesAction());
  }

  private processResponse(response: IEmptyResponse) {
    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
    this.refreshStore();
    this.vehiclesQuery.refetch();
  }

  private async fetchVehicles(): Promise<PaginatedData<IVehicle> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.paginationService.getPaginationParams();
      const response = await lastValueFrom(this.vehiclesUsecase.getAll(currentParams));
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

  private processVehiclesQueryData(data: PaginatedData<IVehicle> | undefined) {
    return data ?? { items: [], meta: buildFallbackPaginationMetadata(this.paginationService) };
  }

  private handleQueryError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return;
    }
    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
  }

  private observeVehicleTypes(): void {
    this.store
      .select(getVehicleTypes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(types => {
        this.vehicleTypes.set(types || []);
        if (!types || types.length === 0) {
          this.store.dispatch(getVehicleTypesAction());
        }
      });
  }
}
