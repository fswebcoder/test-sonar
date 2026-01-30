import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SamplesUseCase } from '@/domain/use-cases/lims/management/samples.usecase';
import { SamplesUseCase as SamplesReceptionsUseCase } from '@/domain/use-cases/lims/samples/samples.usecase';
import { catchError, finalize, of, tap } from 'rxjs';
import { LoadingService } from '@/shared/services/loading.service';
import { SamplesDetailDumpComponent } from '../samples-detail-dump/samples-detail-dump.component';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { selectCommonPrinters } from '@/store/selectors/common/common.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { PrintersUseCase } from '@/domain/use-cases/common/printers.usecase';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastCustomService } from '@SV-Development/utilities';
import ISampleDetailEntity from '@/domain/entities/lims/management/sample-detail.entity';
import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';

@Component({
  selector: 'svi-samples-detail-smart',
  imports: [SamplesDetailDumpComponent],
  templateUrl: './samples-detail-smart.component.html',
  styleUrl: './samples-detail-smart.component.scss'
})
export class SamplesDetailSmartComponent {
  private readonly sampleId = inject(ActivatedRoute).snapshot.params['id'];
  private readonly samplesUseCase = inject(SamplesUseCase);
  private readonly samplesReceptionUseCase = inject(SamplesReceptionsUseCase);
  private readonly router = inject(Router);
  private readonly loading = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly printersUseCase = inject(PrintersUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);

  sample = signal<ISampleDetailEntity>({} as ISampleDetailEntity);
  printers = signal<IPrinter[]>([]);
  duplicateLoading = signal(false);

  @ViewChild(SamplesDetailDumpComponent) samplesDetailDumpComponent?: SamplesDetailDumpComponent;

  ngOnInit(): void {
    this.loadInitialData();
    this.fetchSample();
  }

  fetchSample() {
    this.loading.startLoading('general');
    this.samplesUseCase
      .getById(this.sampleId)
      .pipe(
        tap(response => {
          if (response.statusCode === 200 && response.data) {
            this.sample.set(response.data as ISampleDetailEntity);
          } else {
            this.router.navigate(['/lims/gestion-muestras']);
          }
        }),
        catchError(error => {
          this.router.navigate(['/lims/gestion-muestras']);
          return of(null);
        }),
        finalize(() => {
          this.loading.stopLoading('general');
        })
      )
      .subscribe();
  }

  loadInitialData() {
    this.store
      .select(selectCommonPrinters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(printers => {
        this.printers.set(printers);
      });
  }

  print(event: IPrintParams) {
    this.loadingService.setButtonLoading('loading-print-sample-button', true);
    this.printersUseCase
      .print(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('loading-print-sample-button', false))
      )
      .subscribe({
        next: response => {
          this.toastService.success(response.message);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        }
      });
  }

  printBulk(event: IPrintBulkParams) {
    this.loadingService.setButtonLoading('loading-print-sample-button', true);
    this.printersUseCase
      .printBulk(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('loading-print-sample-button', false))
      )
      .subscribe({
        next: response => {
          this.toastService.success(response.message);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        }
      });
  }

  duplicateSample(event: IRepeateSampleParamsEntity) {
    this.duplicateLoading.set(true);
    this.samplesReceptionUseCase
      .repeatSample(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.duplicateLoading.set(false))
      )
      .subscribe({
        next: response => {
          this.toastService.success(response.message);
          this.samplesDetailDumpComponent?.closeDuplicateDialog();
          if (response.data) {
            this.samplesDetailDumpComponent?.askPrintDuplicatedSample(response.data);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        }
      });
  }
}
