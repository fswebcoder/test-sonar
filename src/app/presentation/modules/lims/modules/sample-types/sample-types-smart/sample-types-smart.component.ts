import { Component, computed, DestroyRef, inject, ViewChild } from '@angular/core';
import { SampleTypesDumpComponent } from '../sample-types-dump/sample-types-dump.component';
import { PaginationService } from '@/shared/services/pagination.service';
import { SampleTypesUseCase } from '@/domain/use-cases/lims/sample-types/sample-types.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { IGeneralResponse, PaginationMetadata, ToastCustomService } from '@SV-Development/utilities';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { catchError, finalize, lastValueFrom, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IListSampleTypesResponseEntity } from '@/domain/entities/lims/sample-types/list-sample-types-response.entity';
import { ISampleTypeEntity } from '@/domain/entities/lims/sample-types/sample-type.entity';
import { ICreateSampleTypeParams } from '@/domain/entities/lims/sample-types/create-sample-type-params.entity';
import { IEditSampleTypeParams } from '@/domain/entities/lims/sample-types/edit-sample-type-params.entity';
import { ERROR_OPERATION_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { HttpErrorResponse } from '@angular/common/http';
import { FormMode } from '@/shared/types/form-mode.type';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';

@Component({
  selector: 'svi-sample-types-smart',
  imports: [SampleTypesDumpComponent],
  templateUrl: './sample-types-smart.component.html',
  styleUrl: './sample-types-smart.component.scss'
})
export class SampleTypesSmartComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly paginationService = inject(PaginationService);
  private readonly sampleTypesUseCase = inject(SampleTypesUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);

  ngOnInit() {
    this.paginationService.resetPagination();
  }

  private readonly sampleTypesQuery = injectQuery(() => ({
    queryKey: ['sampleTypes', this.paginationService.getPaginationParams()],
    queryFn: async () => await this.fetchSampleTypes(),
    enabled: true
  }));

  samplesQueryData = computed(() => this.sampleTypesQuery.data()?.data.items || ([] as ISampleTypeEntity[]));
  samplesQueryMeta = computed(() => this.sampleTypesQuery.data()?.data.meta || ({} as PaginationMetadata));

  @ViewChild('sampleTypesDump') sampleTypesDumpComponent!: SampleTypesDumpComponent;

  private executeOperation = async <T>(
    operation: FormMode,
    data?: T
  ) => {
    this.loadingService.startLoading('general');
    let action$;

    switch (operation) {
      case 'create':
        action$ = this.sampleTypesUseCase.create(data as ICreateSampleTypeParams);
        break;
      case 'edit':
        action$ = this.sampleTypesUseCase.edit(data as IEditSampleTypeParams);
        break;
      case 'delete':
        action$ = this.sampleTypesUseCase.inactivate(data as string);
        break;
      case 'activate':
        action$ = this.sampleTypesUseCase.activate(data as string);
        break;
      default:
        this.loadingService.stopLoading('general');
        return;
    }

    return await lastValueFrom(
      action$.pipe(
        finalize(() => this.loadingService.stopLoading('general')),
        takeUntilDestroyed(this.destroyRef),
        tap((res: IEmptyResponse) => this.processResponse(res, false)),
        catchError((error: HttpErrorResponse) => {
          this.processResponse(error, true);
          return of(null);
        })
      )
    );
  };

  createSampleType = async (data: ICreateSampleTypeParams) =>
    this.executeOperation('create', data);

  editSampleType = async (data: IEditSampleTypeParams) =>
    this.executeOperation('edit', data);

  inactivateSampleType = async (id: string) =>
    this.executeOperation('delete', id);

  activateSampleType = async (id: string) =>
    this.executeOperation('activate', id);
  private async fetchSampleTypes() {
    this.loadingService.startLoading('general');
    return await lastValueFrom(
      this.sampleTypesUseCase.getAll(this.paginationService.getPaginationParams()).pipe(
        finalize(() => this.loadingService.stopLoading('general')),
        takeUntilDestroyed(this.destroyRef),
        tap((res: IListSampleTypesResponseEntity) => {
          this.loadingService.stopLoading('general');
          this.paginationService.setTotalRecords(res.data.meta.total);
          return res;
        }),
        catchError((error: HttpErrorResponse) => {
          this.loadingService.stopLoading('general');
          this.processResponse(error, true);
          return of();
        })
      )
    );
  }

  private processResponse = (
    response: IGeneralResponse<unknown> | HttpErrorResponse,
    isError: Boolean,
    showToast = true
  ) => {
    let error = response as HttpErrorResponse;
    if (isError && showToast) {
      this.toastService.error(error.error.message ?? ERROR_OPERATION_TITLE);
    } else if (!isError && showToast) {
      this.sampleTypesQuery.refetch();
      this.sampleTypesDumpComponent.closeAllDialogs();
      this.toastService.success(response.message ?? SUCCESS_OPERATION_TITLE);
    } else {
      return;
    }
  };
}
