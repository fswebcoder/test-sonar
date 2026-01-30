import { Component, DestroyRef, computed, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { finalize, lastValueFrom } from 'rxjs';

import { DriversDumpComponent } from '@/presentation/modules/scale/modules/drivers/drivers-dump/drivers-dump.component';
import { DriversUsecase } from '@/domain/use-cases/scale/drivers/drivers.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService, PaginatedData } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { ICreateDriverParamsEntity } from '@/domain/entities/scale/drivers/create-driver-params.entity';
import { IUpdateDriverParamsEntity } from '@/domain/entities/scale/drivers/update-driver-params.entity';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { getDriversAction } from '@/store/actions/common/common.action';
import { Store } from '@ngrx/store';
import { buildFallbackPaginationMetadata } from '@/shared/helpers/pagination-metadata.helper';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { selectCommonDocumentTypes } from '@/store/selectors/common/common.selectors';

@Component({
  selector: 'svi-drivers-smart',
  imports: [DriversDumpComponent],
  templateUrl: './drivers-smart.component.html',
  styleUrl: './drivers-smart.component.scss'
})
export class DriversSmartComponent {
  private readonly driversUsecase = inject(DriversUsecase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  @ViewChild(DriversDumpComponent) driversDumpComponent!: DriversDumpComponent;

  documentTypes = signal<IDocumentTypeResponse[]>([]);

  ngOnInit(): void {
    this.loadInitialData();
    this.paginationService.resetPagination();
  }

  private loadInitialData(): void {
    this.store.select(selectCommonDocumentTypes).subscribe(documentTypes => {
      this.documentTypes.set(documentTypes);
    });
  }

  private readonly driversQuery = injectQuery(() => ({
    queryKey: ['drivers', this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchDrivers(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true
  }));

  driversQueryData = computed(() => {
    const queryData = this.driversQuery.data();
    return this.processDriversQueryData(queryData);
  });

  createDriver(driver: ICreateDriverParamsEntity) {
    this.loadingService.setButtonLoading('modal-driver-button', true);
    this.driversUsecase
      .create(driver)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-driver-button', false))
      )
      .subscribe({
        next: response => {
          this.driversDumpComponent.closeDriverModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  updateDriver(driver: IUpdateDriverParamsEntity) {
    this.loadingService.setButtonLoading('modal-driver-button', true);
    this.driversUsecase
      .update(driver)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-driver-button', false))
      )
      .subscribe({
        next: response => {
          this.driversDumpComponent.closeDriverModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  activateDriver(id: string) {
    this.loadingService.setButtonLoading('modal-driver-button', true);
    this.driversUsecase.activate(id)
      .pipe(finalize(() => this.loadingService.setButtonLoading('modal-driver-button', false)))
      .subscribe({
        next: response => this.processResponse(response),
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  deactivateDriver(id: string) {
    this.loadingService.setButtonLoading('modal-driver-button', true);
    this.driversUsecase.desactivate(id)
      .pipe(finalize(() => this.loadingService.setButtonLoading('modal-driver-button', false)))
      .subscribe({
        next: response => this.processResponse(response),
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  private processResponse(response: IEmptyResponse) {
    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
    this.store.dispatch(getDriversAction());
    this.driversQuery.refetch();
  }

  private async fetchDrivers(): Promise<PaginatedData<IDriverEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.paginationService.getPaginationParams();
      const response = await lastValueFrom(this.driversUsecase.getAll(currentParams));
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

  private processDriversQueryData(data: PaginatedData<IDriverEntity> | undefined) {
    return data ?? { items: [], meta: buildFallbackPaginationMetadata(this.paginationService) };
  }

  private handleQueryError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return;
    }
    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
  }
}
