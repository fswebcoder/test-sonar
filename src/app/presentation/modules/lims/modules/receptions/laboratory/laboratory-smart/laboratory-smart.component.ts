import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { LaboratoryDumpComponent } from "../laboratory-dump/laboratory-dump.component";
import { LaboratoryReceptionUseCase } from '@/domain/use-cases/lims/receptions/laboratory/laboratory-receptions.usecase';
import { ILaboratoryReceptionParams } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import ISampleLaboratoryReceptionsResponse from '@/domain/entities/lims/receptions/laboratory/sample-laboratory-receptions.entity';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '@/shared/services/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_OPERATION_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { Store } from '@ngrx/store';
import { getAnalysisTypes } from '@/store/selectors/common/common.selectors';

@Component({
  selector: 'svi-laboratory-smart',
  imports: [LaboratoryDumpComponent],
  templateUrl: './laboratory-smart.component.html',
  styleUrl: './laboratory-smart.component.scss'
})
export class LaboratorySmartComponent implements OnInit {
  laboratoryReceptionUseCase: LaboratoryReceptionUseCase = inject(LaboratoryReceptionUseCase)
  toastService = inject(ToastCustomService);
  destroyRef = inject(DestroyRef);
  loadingService = inject(LoadingService);
  store = inject(Store);

  analysisTypes = signal<IAnalysisTypeResponse[]>([]);
  sample = signal<ISampleLaboratoryReceptionsResponse | null>(null);

  @ViewChild(LaboratoryDumpComponent) laboratoryDumpComponent!: LaboratoryDumpComponent;

  ngOnInit(): void {
    this.loadInitialData();
  }

  createLaboratoryReception(event: ILaboratoryReceptionParams) {
    this.loadingService.startLoading('general');
    this.laboratoryReceptionUseCase.analyze(event).pipe(
      finalize(() => this.loadingService.stopLoading('general')),
      takeUntilDestroyed(this.destroyRef),
      tap((res) => {
        this.processResponse(res, false);
        this.clearFormAndSample();
      }),
      catchError((err: HttpErrorResponse) => {
        this.processResponse(err, true);
        return of(null);
      })
    ).subscribe();
  }

  sampleCodeChanges(code: string) {
    this.loadingService.startLoading('general');
    this.laboratoryReceptionUseCase.getSample(code).pipe(
      finalize(() => this.loadingService.stopLoading('general')),
      takeUntilDestroyed(this.destroyRef),
      tap((res) => {
        this.sample.set(res.data);
        this.processResponse(res, false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.processResponse(err, true);
        this.clearFormAndSample();
        return of(null);
      }),
    ).subscribe();
  }

  cancel() {
    this.clearFormAndSample();
  }

  private loadInitialData(){
    this.store.select(getAnalysisTypes).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(types => {
      this.analysisTypes.set(types);
    })
  }

  private processResponse = (response: IGeneralResponse<unknown> | HttpErrorResponse, isError: Boolean, showToast = true) => {
    let error = response as HttpErrorResponse;
    if(isError && showToast){
      this.toastService.error(error.error.message ?? ERROR_OPERATION_TITLE);
    }  else if(!isError && showToast){
      this.toastService.success(response.message ?? SUCCESS_OPERATION_TITLE);
    } else {
      return
    }
  }

  private clearFormAndSample(){
    this.sample.set(null);
    this.laboratoryDumpComponent.clearAllForms();
  }
}
