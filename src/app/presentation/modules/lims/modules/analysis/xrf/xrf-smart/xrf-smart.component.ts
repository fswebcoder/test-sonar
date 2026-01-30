import { Component, inject, signal, ViewChild } from '@angular/core';
import { XrfDumpComponent } from '../xrf-dump/xrf-dump.component';
import { IXrfParamsEntity } from '@/domain/entities/lims/analysis/xrf/xrf-params.entity';
import { XrfUseCase } from '@/domain/use-cases/lims/analysis/xrf.usecase';
import { REGISTER_ERROR_TITLE, REGISTER_SUCCESS_TITLE } from '@/shared/constants/general.contant';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { finalize } from 'rxjs';
import { IErrorsXrfResponseEntity, IXrfResponseEntity } from '@/domain/entities/lims/analysis/xrf/xrf-response';

@Component({
  selector: 'svi-xrf-smart',
  imports: [XrfDumpComponent],
  templateUrl: './xrf-smart.component.html',
  styleUrl: './xrf-smart.component.scss'
})
export class XrfSmartComponent {
  @ViewChild(XrfDumpComponent) dumpComponent!: XrfDumpComponent;

  xrfUseCase = inject(XrfUseCase);
  messageService = inject(ToastCustomService);
  loadingService = inject(LoadingService);

  currentErrors = signal<IErrorsXrfResponseEntity | null>(null);

  onSaveXrf(params: IXrfParamsEntity) {
    this.loadingService.setButtonLoading('create-xrf-btn', true);
    this.xrfUseCase
      .create(params)
      .pipe(finalize(() => this.loadingService.setButtonLoading('create-xrf-btn', false)))
      .subscribe({
        next: response => {
          this.processXrfResponse(response);
          this.dumpComponent.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.error(err.error.message || REGISTER_ERROR_TITLE);
        }
      });
  }

  downloadErrors() {
    if (!this.currentErrors()) {
      return;
    }
    this.currentErrors.set(null);
  }

  clearErrors() {
    this.currentErrors.set(null);
  }

  private processXrfResponse(res: IXrfResponseEntity): void {
    if (
      res.data.repeatedSampleCodes.length === 0 &&
      res.data.samplesWithNoQuarteringAnalysis.length === 0 &&
      res.data.samplesWithXRFAnalysis.length === 0
    ) {
      this.messageService.success(res.message || REGISTER_SUCCESS_TITLE);
    } else {
      this.currentErrors.set(res.data);
    }
  }
}
