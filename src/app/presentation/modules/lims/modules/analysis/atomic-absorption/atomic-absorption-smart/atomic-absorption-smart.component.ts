import { Component, inject, ViewChild } from '@angular/core';
import { AtomicAbsorptionDumpComponent } from '../atomic-absorption-dump/atomic-absorption-dump.component';
import { IAtomicAbsorptionParamsEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-params.entity';
import { AtomicAbsorptionUseCase } from '@/domain/use-cases/lims/analysis/atomic-absorption.usecase';
import { REGISTER_ERROR_TITLE, REGISTER_SUCCESS_TITLE } from '@/shared/constants/general.contant';
import { HttpErrorResponse } from '@angular/common/http';
import { IAtomicAbsorptionResponseEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-response.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { finalize } from 'rxjs';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';

@Component({
  selector: 'svi-atomic-absorption-smart',
  imports: [AtomicAbsorptionDumpComponent],
  templateUrl: './atomic-absorption-smart.component.html',
  styleUrl: './atomic-absorption-smart.component.scss'
})
export class AtomicAbsorptionSmartComponent {

  @ViewChild(AtomicAbsorptionDumpComponent) dumpComponent!: AtomicAbsorptionDumpComponent;

  private atomicAbsorptionUseCase = inject(AtomicAbsorptionUseCase);
  private messageService = inject(ToastCustomService);
  private loadingService = inject(LoadingService);

  saveAtomicAbsorption(data: IAtomicAbsorptionParamsEntity) {
    data.analysisDate = new Date().toISOString();
    this.loadingService.setButtonLoading('create-atomic-absorption-btn', true);
    this.atomicAbsorptionUseCase.create(data).pipe(
      finalize(() => this.loadingService.setButtonLoading('create-atomic-absorption-btn', false))
    ).subscribe({
      next: (res) => {
        this.processAtomicAbsorptionResponse(res || null);
        this.dumpComponent.resetForm();
      },
      error: (err:HttpErrorResponse) => {
        this.messageService.error(err.error.message || REGISTER_ERROR_TITLE);
      }
    });

  }

  private processAtomicAbsorptionResponse(res: IGeneralResponse<IAtomicAbsorptionResponseEntity> | null): void {
    if (!res) return this.messageService.error(REGISTER_ERROR_TITLE);

    return res.statusCode === 200
      ? this.messageService.success(res.message || REGISTER_SUCCESS_TITLE)
      : this.messageService.error(res.message || REGISTER_ERROR_TITLE);
  }
}
