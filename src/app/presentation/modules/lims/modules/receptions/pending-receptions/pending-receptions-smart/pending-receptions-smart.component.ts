import { IPendingReceptionEntity } from '@/domain/entities/lims/receptions/pending-receptions/pending-reception.entity';
import { PendingReceptionsUsecase } from '@/domain/use-cases/lims/receptions/pending-receptions/pending-receptions.usecase';
import { ERROR_LOADING_DATA_TITLE } from '@/shared/constants/general.contant';
import { LoadingService } from '@/shared/services/loading.service';
import { Component, computed, inject, signal } from '@angular/core';
import { ToastCustomService } from '@SV-Development/utilities';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { PendingReceptionsDumpComponent } from "../pending-receptions-dump/pending-receptions-dump.component";
import { ICompletePendingReceptionParamsEntity } from '@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity';
import { HttpErrorResponse } from '@angular/common/http';
import { SampleScaleUsecase } from '@/domain/use-cases/lims/sample-scale/sample-scale.usecase';
import { ESampleScales } from '@/shared/enums/sample-scales.enum';
import { IReadScaleResponseEntity } from '@/domain/entities/lims/sample-scale/read-scale-response.entity';

@Component({
  selector: 'svi-pending-receptions-smart',
  templateUrl: './pending-receptions-smart.component.html',
  imports: [PendingReceptionsDumpComponent]
})
export class PendingReceptionsSmartComponent {

  private toastCustomService = inject(ToastCustomService);
  private loadingService = inject(LoadingService);
  private pendingReceptionsUsecase = inject(PendingReceptionsUsecase);
  private sampleScaleUseCase = inject(SampleScaleUsecase);

  weight = signal<number | null>(null);
  allowManualWeight = signal(false);
  isReadingWeight = signal(false);

  private readonly pendingSamplesQuery = injectQuery(() => ({
    queryKey: ['pending-receptions'],
    queryFn: () => this.fetchPendingReceptions(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true
  }));

  pendingReceptionsQueryData = computed<IPendingReceptionEntity[]>(() => this.pendingSamplesQuery.data() ?? []);

  private async fetchPendingReceptions(): Promise<IPendingReceptionEntity[] | undefined> {
      this.loadingService.startLoading('general');
      try {
        const response = await lastValueFrom(this.pendingReceptionsUsecase.getAll());
        return response.data;
      } catch (error) {
        this.handleQueryError(error as HttpErrorResponse);
        return undefined;
      } finally {
        this.loadingService.stopLoading('general');
      }
    }

  private handleQueryError(error: HttpErrorResponse) {
    this.toastCustomService.error(error.error.message || ERROR_LOADING_DATA_TITLE)
  }

  async onCompleteReception(params: ICompletePendingReceptionParamsEntity) {
    this.loadingService.startLoading('general');
    try {
      await lastValueFrom(this.pendingReceptionsUsecase.completePendingReception(params));
      this.toastCustomService.success('Recepción completada correctamente');
      await this.pendingSamplesQuery.refetch();
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('general');
    }
  }

  async onRequestReadWeight(): Promise<void> {
    if (this.isReadingWeight()) return;
    this.isReadingWeight.set(true);
    try {
      const response = await lastValueFrom<IReadScaleResponseEntity<false>>(
        this.sampleScaleUseCase.readWeight({ scaleName: ESampleScales.RECEPCION })
      );
      const readWeight = response.data?.weight?.weight ?? null;
      if (response.message) {
        this.toastCustomService.info(response.message);
      }
      this.weight.set(readWeight ? readWeight+10 : 10);
      const enableManual = readWeight === null;
      this.allowManualWeight.set(enableManual);
      if (enableManual) {
        this.toastCustomService.info('La báscula no devolvió un peso. Ingrese el valor manualmente.');
      }
    } catch (error) {
      this.allowManualWeight.set(true);
      this.weight.set(null);
      this.toastCustomService.error('No fue posible leer el peso desde la báscula. Intente nuevamente.');
    } finally {
      this.isReadingWeight.set(false);
    }
  }

  onModalOpened(reception: IPendingReceptionEntity): void {
    this.resetWeightState(reception.weight ?? null);
  }

  onModalClosed(): void {
    this.resetWeightState(null);
  }

  private resetWeightState(initialWeight: number | null): void {
    this.weight.set(initialWeight);
    this.allowManualWeight.set(false);
    this.isReadingWeight.set(false);
  }
}
