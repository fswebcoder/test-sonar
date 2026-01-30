import { SamplesUseCase } from '@/domain/use-cases/lims/management/samples.usecase';
import { PaginationService } from '@/shared/services/pagination.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { IGeneralResponse, PaginatedData, ToastCustomService, TPaginationParams } from '@SV-Development/utilities';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { SamplesDumpComponent } from '../samples-dump/samples-dump.component';
import { finalize, lastValueFrom } from 'rxjs';
import { ISampleEntity } from '@/domain/entities/lims/management/sample.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { PrintersUseCase } from '@/domain/use-cases/common/printers.usecase';
import { Store } from '@ngrx/store';
import { selectCommonPrinters } from '@/store/selectors/common/common.selectors';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { UNEXPECTED_ERROR_TITLE } from '@/shared/constants/general.contant';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';
import { SamplesDropdownUseCase } from '@/domain/use-cases/lims/management/samples-dropdown.usecases';
import { ISamplesDropdownEntity } from '@/domain/entities/lims/management/samples-dropdown.entity';

@Component({
  selector: 'svi-samples-smart',
  templateUrl: './samples-smart.component.html',
  styleUrl: './samples-smart.component.scss',
  imports: [SamplesDumpComponent]
})
export class SamplesSmartComponent {
  private readonly paginationService = inject(PaginationService);
  private readonly samplesUseCase = inject(SamplesUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly printerUseCase = inject(PrintersUseCase);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly samplesDropdownUseCase = inject(SamplesDropdownUseCase);

  private params = signal<TPaginationParams>({
    ...this.paginationService.getPaginationParams()
  } as TPaginationParams);
  printers = signal<IPrinter[]>([]);

  samplesQueryData = computed<PaginatedData<ISampleEntity>>(() => {
    const response = this.samplesQuery.data()!;
    return response ? response : ({} as PaginatedData<ISampleEntity>);
  });

  samplesDropdownQueryData = computed(() => {
    const response = this.samplesDropdownQuery.data();
    return response ? response : ({} as ISamplesDropdownEntity);
  });

  ngOnInit(): void {
    this.loadInitialData();
  }

  private readonly samplesQuery = injectQuery(() => ({
    queryKey: ['samples', this.params()],
    queryFn: () => {
      return this.fetchSamples();
    },
    enabled: !!(this.params().startDate || this.params().endDate),
    onError: (error: HttpErrorResponse) => {
      this.handleQueryError(error);
    },
    refetchOnMount: 'always'
  }));

  private readonly samplesDropdownQuery = injectQuery(() => ({
    queryKey: ['samples-dropdown', this.params()],
    queryFn: () => this.fetchSamplesDropDown(),
    enabled: !!(this.params().startDate || this.params().endDate),
    refetchOnMount: 'always'
  }));

  async fetchSamples(): Promise<PaginatedData<ISampleEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.params();
      const response = await lastValueFrom(this.samplesUseCase.getAll(currentParams!));

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

  async fetchSamplesDropDown() {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.params();
      const response = await lastValueFrom(
        this.samplesDropdownUseCase.getAll({
          startDate: currentParams.startDate,
          endDate: currentParams.endDate
        })
      );
      return response.data;
    } catch (error) {
      return undefined;
    } finally {
      this.loadingService.stopLoading('general');
    }
  }
  private handleQueryError(error: HttpErrorResponse): void {
    this.loadingService.stopLoading('general');
    this.toastCustomService.error('Error', error.error.message || UNEXPECTED_ERROR_TITLE);
  }

  private loadInitialData() {
    this.store
      .select(selectCommonPrinters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(printers => {
        this.printers.set(printers || []);
      });
  }

  private handlePrintResponse(response: IGeneralResponse<IPrintResponse>) {
    if (response.statusCode === 201) {
      this.toastCustomService.success('Información', 'Impresión exitosa');
    } else {
      this.toastCustomService.error('Error', response.message);
    }
  }

  paramsChange(params: TPaginationParams) {
    this.params.set(params);
  }

  printSample(event: IPrintParams) {
    this.loadingService.setButtonLoading('loading-print-sample-button', true);
    this.printerUseCase
      .print(event)
      .pipe(finalize(() => this.loadingService.setButtonLoading('loading-print-sample-button', false)))
      .subscribe({
        next: response => {
          this.handlePrintResponse(response);
        },
        error: error => {
          const title = error.error.message || UNEXPECTED_ERROR_TITLE;
          this.toastCustomService.error('Error', title);
        }
      });
  }
}
