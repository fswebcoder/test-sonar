import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { MoistureDeterminationDumpComponent } from '../moisture-determination-dump/moisture-determination-dump.component';
import { MoistureDeterminationUseCase } from '@/domain/use-cases/lims/analysis/moisture-determination.usecase';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { REGISTER_ERROR_TITLE, REGISTER_SUCCESS_TITLE } from '@/shared/constants/general.contant';
import { finalize } from 'rxjs';
import { LoadingService } from '@/shared/services/loading.service';
import { ICreateMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/create-moisture-determination-params.entity';
import { ISampleMoistureDeterminationResponseEntity } from '@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-response.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUpdateMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/update-moisture-determination-params.entity';
import { ToastCustomService } from '@SV-Development/utilities';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';

@Component({
  selector: 'svi-moisture-determination-smart',
  imports: [MoistureDeterminationDumpComponent],
  templateUrl: './moisture-determination-smart.component.html',
  styleUrl: './moisture-determination-smart.component.scss'
})
export class MoistureDeterminationSmartComponent {
  @ViewChild(MoistureDeterminationDumpComponent) dumpComponent!: MoistureDeterminationDumpComponent;

  private moistureDeterminationUseCase = inject(MoistureDeterminationUseCase);
  private messageService = inject(ToastCustomService);
  private loadingService = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);

  selectedSample = signal<ISampleMoistureDeterminationResponseEntity | null>(null);

  saveMoistureDetermination(data: ICreateMoistureDeterminationParamsEntity) {
    this.loadingService.setButtonLoading('create-moisture-determination-btn', true);
    this.moistureDeterminationUseCase
      .create(data)
      .pipe(finalize(() => this.loadingService.setButtonLoading('create-moisture-determination-btn', false)))
      .subscribe({
        next: res => {
          this.processMoistureDeterminationResponse(res || null);
          this.resetSelectedSample();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.error(err.error.message || REGISTER_ERROR_TITLE);
        }
      });
  }

  updateMoistureDetermination(data: IUpdateMoistureDeterminationParamsEntity) {
    this.loadingService.setButtonLoading('update-moisture-determination-btn', true);
    this.moistureDeterminationUseCase
      .update(data)
      .pipe(finalize(() => this.loadingService.setButtonLoading('update-moisture-determination-btn', false)))
      .subscribe({
        next: res => {
          this.processMoistureDeterminationResponse(res);
          this.resetSelectedSample();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.error(err.error.message || REGISTER_ERROR_TITLE);
        }
      });
  }

  private processMoistureDeterminationResponse(res: IEmptyResponse): void {
    if (!res) return this.messageService.error(REGISTER_ERROR_TITLE);

    return res.statusCode === HttpStatusCode.Created || res.statusCode === HttpStatusCode.Ok
      ? this.messageService.success(res.message || REGISTER_SUCCESS_TITLE)
      : this.messageService.error(res.message || REGISTER_ERROR_TITLE);
  }

  changeSampleId(sampleId: string) {
    this.loadingService.startLoading('general');
    this.moistureDeterminationUseCase
      .getSample({ sampleId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.stopLoading('general'))
      )
      .subscribe({
        next: res => {
          this.selectedSample.set(res || null);
          this.messageService.success('Éxito al obtener la muestra', 'Ingresa los datos de la muestra');
        }
      });
  }

  resetSelectedSample() {
    this.selectedSample.set(null);
    this.dumpComponent.resetForm();
  }
}
