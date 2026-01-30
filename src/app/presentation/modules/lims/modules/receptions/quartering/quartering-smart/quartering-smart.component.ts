import { LoadingService } from '@shared/services/loading.service';
import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { QuarteringDumpComponent } from '../quartering-dump/quartering-dump.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { QuarteringsReceptionUseCase } from '@/domain/use-cases/lims/receptions/quarterings/quarterings-reception.usecase';
import { finalize } from 'rxjs';
import { IQuarteringParamsEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-params.entity';
import { ISampleQuarteringDetailsResponseEntity } from '@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';

@Component({
  selector: 'svi-quartering-smart',
  standalone: true,
  imports: [QuarteringDumpComponent],
  templateUrl: './quartering-smart.component.html',
  styleUrl: './quartering-smart.component.scss'
})
export class QuarteringSmartComponent {
  private readonly quarteringsReceptionUseCase = inject(QuarteringsReceptionUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);
  private readonly destroyRef = inject(DestroyRef);

  sampleDetail = signal<ISampleQuarteringDetailsResponseEntity>({} as ISampleQuarteringDetailsResponseEntity);

  printers = signal<IPrinter[]>([]);

  @ViewChild(QuarteringDumpComponent) quarteringDumpComponent!: QuarteringDumpComponent;

  getSampleDetail(event: any) {
    this.loadingService.startLoading('general');
    this.quarteringsReceptionUseCase
      .getById(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.stopLoading('general'))
      )
      .subscribe({
        next: response => this.processSampleDetail(response),
        error: error => this.handleErrorSampleDetail(error)
      });
  }

  processSampleDetail(response: IGeneralResponse<ISampleQuarteringDetailsResponseEntity>) {
    this.sampleDetail.set(response.data as ISampleQuarteringDetailsResponseEntity);
  }

  handleErrorSampleDetail(error: HttpErrorResponse) {
    this.loadingService.stopLoading('general');
    this.toastService.error(error.error.message);
  }

  saveQuarterings(event: IQuarteringParamsEntity) {
    this.loadingService.startLoading('general');
    const data = {
      sampleCode: event.sampleCode,
      quartering: event.quartering
    };
    this.quarteringsReceptionUseCase
      .create(data)
      .pipe(finalize(() => this.loadingService.stopLoading('general')))
      .subscribe({
        next: response => {
          this.toastService.success(response.message);
          this.quarteringDumpComponent.resetAllForms();
          this.quarteringDumpComponent.form.reset();
          this.sampleDetail.set({} as ISampleQuarteringDetailsResponseEntity);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
        }
      });
  }
}
