import { Component, DestroyRef, computed, inject, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { finalize, lastValueFrom } from 'rxjs';

import { MaterialTypesDumpComponent } from '@/presentation/modules/scale/modules/material-types/material-types-dump/material-types-dump.component';
import { MaterialTypesUsecase } from '@/domain/use-cases/scale/material-types/material-types.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService, PaginatedData } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { ICreateMaterialTypeParamsEntity } from '@/domain/entities/scale/material-types/create-material-type-params.entity';
import { IUpdateMaterialTypeParamsEntity } from '@/domain/entities/scale/material-types/update-material-type-params.entity';
import { IMaterialTypeEntity } from '@/domain/entities/scale/material-types/material-type.entity';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { buildFallbackPaginationMetadata } from '@/shared/helpers/pagination-metadata.helper';
import { Store } from '@ngrx/store';
import { getMaterialTypesAction } from '@/store/actions/common/common.action';

@Component({
  selector: 'svi-material-types-smart',
  standalone: true,
  imports: [MaterialTypesDumpComponent],
  templateUrl: './material-types-smart.component.html',
  styleUrl: './material-types-smart.component.scss'
})
export class MaterialTypesSmartComponent {
  private readonly materialTypesUsecase = inject(MaterialTypesUsecase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  @ViewChild(MaterialTypesDumpComponent) materialTypesDumpComponent!: MaterialTypesDumpComponent;

  ngOnInit(): void {
    this.paginationService.resetPagination();
  }

  private readonly materialTypesQuery = injectQuery(() => ({
    queryKey: ['material-types', this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchMaterialTypes(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true
  }));

  materialTypesQueryData = computed(() => {
    const queryData = this.materialTypesQuery.data();
    return this.processMaterialTypesQueryData(queryData);
  });

  createMaterialType(materialType: ICreateMaterialTypeParamsEntity) {
    this.loadingService.setButtonLoading('modal-material-type-button', true);
    this.materialTypesUsecase
      .create(materialType)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-material-type-button', false))
      )
      .subscribe({
        next: response => {
          this.materialTypesDumpComponent.closeMaterialTypeModal();
          this.processResponse(response, true);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  updateMaterialType(materialType: IUpdateMaterialTypeParamsEntity) {
    this.loadingService.setButtonLoading('modal-material-type-button', true);
    this.materialTypesUsecase
      .update(materialType)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-material-type-button', false))
      )
      .subscribe({
        next: response => {
          this.materialTypesDumpComponent.closeMaterialTypeModal();
          this.processResponse(response, true);
        },
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  activateMaterialType(id: string) {
    this.loadingService.setButtonLoading('modal-material-type-button', true);
    this.materialTypesUsecase
      .activate(id)
      .pipe(finalize(() => this.loadingService.setButtonLoading('modal-material-type-button', false)))
      .subscribe({
        next: response => this.processResponse(response, true),
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  deactivateMaterialType(id: string) {
    this.loadingService.setButtonLoading('modal-material-type-button', true);
    this.materialTypesUsecase
      .desactivate(id)
      .pipe(finalize(() => this.loadingService.setButtonLoading('modal-material-type-button', false)))
      .subscribe({
        next: response => this.processResponse(response, true),
        error: (error: HttpErrorResponse) => this.handleQueryError(error)
      });
  }

  private processResponse(response: IEmptyResponse, updatecatalog: boolean = false): void {
    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
    this.materialTypesQuery.refetch();
    if (updatecatalog) {
      this.store.dispatch(getMaterialTypesAction())
    }
  }

  private async fetchMaterialTypes(): Promise<PaginatedData<IMaterialTypeEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.paginationService.getPaginationParams();
      const response = await lastValueFrom(this.materialTypesUsecase.getAll(currentParams));
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

  private processMaterialTypesQueryData(data: PaginatedData<IMaterialTypeEntity> | undefined) {
    return data ?? { items: [], meta: buildFallbackPaginationMetadata(this.paginationService) };
  }

  private handleQueryError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return;
    }
    this.toastCustomService.error(error.error?.message || LOAD_DATA_ERROR_TITLE);
  }
}
