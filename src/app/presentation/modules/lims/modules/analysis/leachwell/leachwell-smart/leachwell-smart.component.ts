import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { LeachwellUseCase } from '@/domain/use-cases/lims/analysis/leachwell.usecase';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { finalize, lastValueFrom } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { LeachwellDumpComponent } from '../leachwell-dump/leachwell-dump.component';
import { ILeachwellParamsEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-params.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { ILeachwellResponseEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-response-entity';
import { HttpErrorResponse } from '@angular/common/http';
import { REGISTER_ERROR_TITLE, REGISTER_SUCCESS_TITLE } from '@/shared/constants/general.contant';
import { IGeneralResponse, PaginatedData, ToastCustomService } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';

@Component({
  selector: 'svi-leachwell-smart',
  imports: [LeachwellDumpComponent],
  templateUrl: './leachwell-smart.component.html',
  styleUrl: './leachwell-smart.component.scss'
})
export class LeachwellSmartComponent implements OnInit {
  @ViewChild(LeachwellDumpComponent) dumpComponent!: LeachwellDumpComponent;
  private readonly leachwellsQuery = injectQuery(() => ({
    queryKey: ['leachwells', this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchLeachwell(),
    enabled: true,
    refetchOnMount: 'always'
  }));
  leachwellUseCase = inject(LeachwellUseCase);
  loadingService = inject(LoadingService);
  toastService = inject(ToastCustomService);
  paginationService = inject(PaginationService);

  leachwellQueryData = computed<PaginatedData<ILeachwellResponseEntity>>(() => {
    const result = this.leachwellsQuery.data();
    return result ? result : ({} as PaginatedData<ILeachwellResponseEntity>);
  });

  ngOnInit(): void {
    this.paginationService.resetPagination();
  }

  onPageChange(event: PaginatorState) {
    this.paginationService.updatePagination({
      ...this.paginationService.getPaginationParams(),
      ...event
    });
  }
  async fetchLeachwell(): Promise<PaginatedData<ILeachwellResponseEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.paginationService.getPaginationParams();
      const response = await lastValueFrom(this.leachwellUseCase.getAll(currentParams!));

      if (response.data?.meta?.total !== undefined) {
        this.paginationService.setTotalRecords(response.data.meta.total);
      }

      return response.data;
    } catch (error) {
      return undefined;
    } finally {
      this.loadingService.stopLoading('general');
    }
  }

  onSave(event: ILeachwellParamsEntity) {
    this.loadingService.setButtonLoading('create-leachwell-dialog-button', true);
    this.leachwellUseCase
      .create(event)
      .pipe(
        finalize(() => {
          this.loadingService.setButtonLoading('create-leachwell-dialog-button', false);
        })
      )
      .subscribe({
        next: response => {
          this.proccessLeachwellResponse(response);
          this.dumpComponent.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message || REGISTER_ERROR_TITLE);
        }
      });
  }

  onCompleteAnalisis(event: string) {
    this.loadingService.setButtonLoading('complete-leachwell-btn', true);
    this.leachwellUseCase
      .complete({
        id: event
      })
      .pipe(
        finalize(() => {
          this.loadingService.setButtonLoading('complete-leachwell-btn', false);
        })
      )
      .subscribe({
        next: response => {
          this.proccessLeachwellResponse(response);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message || REGISTER_ERROR_TITLE);
        }
      });
  }

  proccessLeachwellResponse(response: IGeneralResponse<ILeachwellResponseEntity> | IEmptyResponse) {
    if (response) {
      this.leachwellsQuery.refetch();
      this.toastService.success(REGISTER_SUCCESS_TITLE);
    }
  }
}
