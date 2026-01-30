import { Component, computed, inject, signal } from '@angular/core';
import { DoreDumpComponent } from "../dore-dump/dore-dump.component";
import { IDoreUseCase } from '@/domain/use-cases/lims/management/dore.usecase';
import { IDoreParamsEntity } from '@/domain/entities/lims/management/dore-params.entity';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '@/shared/services/loading.service';
import { LOAD_DATA_ERROR_TITLE } from '@/shared/constants/general.contant';
import { lastValueFrom } from 'rxjs';
import { IDoreListResponseEntity } from '@/domain/entities/lims/management/dore-list.response';
import { IDoreDropdownEntity } from '@/domain/entities/lims/management/dore-dropdown-entity';
import { formatDate } from '@/core/utils/format-date';
import { PaginatedData, ToastCustomService } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';

@Component({
  selector: 'svi-dore-smart',
  imports: [DoreDumpComponent],
  templateUrl: './dore-smart.component.html',
  styleUrl: './dore-smart.component.scss'
})
export class DoreSmartComponent {
  private readonly doreUseCase = inject(IDoreUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  paginationService = inject(PaginationService);

  params = signal<IDoreParamsEntity>({} as IDoreParamsEntity);

  doreQueryData = computed(() => this.doreQuery.data() || {} as PaginatedData<IDoreListResponseEntity>);
  doreDropdownQueryData = computed(() => this.doreDropdownQuery.data() || {} as IDoreDropdownEntity);

  onParamsChange(event: IDoreParamsEntity) {
    this.params.set({ ...this.params(), ...event });
    this.doreQuery.refetch();
    this.doreDropdownQuery.refetch();
  }


  private readonly doreQuery = injectQuery(() => ({
    queryKey: ['dore'],
    queryFn: () => this.fetchDore(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error, 'general')
  }));

  private readonly doreDropdownQuery = injectQuery(() => ({
    queryKey: ['dore-dropdown'],
    queryFn: () => this.fetchDoreDropdown(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error, 'general')
  }));

  private fetchDore(): Promise<PaginatedData<IDoreListResponseEntity> | void> {
    const queryParams = this.params();
    this.loadingService.startLoading('general');

    return lastValueFrom(this.doreUseCase.getAll(queryParams))
      .then(response => {
        return this.handleDoreResponse(response)
      })
      .catch(error => this.handleErrorWithToast(error, LOAD_DATA_ERROR_TITLE))
      .finally(() => this.loadingService.stopLoading('general'));
  }

  private fetchDoreDropdown(): Promise<IDoreDropdownEntity | void> {
    const queryParams = this.params();
    return lastValueFrom(this.doreUseCase.getDropdown({
      startDate: formatDate(new Date(queryParams.startDate)),
      endDate: formatDate(new Date(queryParams.endDate))
    }))
      .then(response => this.handleDoreDropdownResponse(response))
      .catch(error => this.handleErrorWithToast(error, LOAD_DATA_ERROR_TITLE));
  }

  private handleDoreResponse(response: any): PaginatedData<IDoreListResponseEntity> {
    return response ? response.data : {} as PaginatedData<IDoreListResponseEntity>;
  }

  private handleDoreDropdownResponse(response: any): IDoreDropdownEntity {
    if (!response || !response.data) {
      return {} as IDoreDropdownEntity;
    }
    return response.data;
  }
  private handleErrorWithToast(error: any, title: string) {
    this.toastCustomService.error('Error', title);
    throw error;
  }


  private handleQueryError(error: HttpErrorResponse, loadingKey: string) {
    this.loadingService.stopLoading(loadingKey);
    this.toastCustomService.error(error.error.message, 'Error')
      ;
  }
}
