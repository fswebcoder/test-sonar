import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { getSuppliers, selectCommonSampleTypes, selectCommonPrinters, getAnalysisTypes } from '@/store/selectors/common/common.selectors';
import { Component, DestroyRef, inject, signal, ViewChild, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SampleSendingDumpComponent } from '../sample-sending-dump/sample-sending-dump.component';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { IIdName } from '@/shared/interfaces/id-name.interface';
import { SampleSendingUsecase } from '@/domain/use-cases/lims/receptions/sample-sending/sample-sending.usecase';
import {
  ICreateSampleSendingParamsEntity
} from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-params.entity';
import { ToastCustomService } from '@SV-Development/utilities';
import { ERROR_OPERATION_TITLE, SUCCESS_OPERATION_TITLE } from '@shared/constants/general.contant';
import { of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { getPrintersAction } from '@/store/actions/common/common.action';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { PrintersUseCase } from '@/domain/use-cases/common/printers.usecase';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';
import { IGeneralResponse } from '@SV-Development/utilities';
import { PermissionService } from '@/core/services';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { LoadingService } from '@/shared/services/loading.service';

@Component({
  selector: 'svi-sample-sending-smart',
  templateUrl: './sample-sending-smart.component.html',
  imports: [SampleSendingDumpComponent]
})
export class SampleSendingSmartComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private sampleSendingUsecase: SampleSendingUsecase = inject(SampleSendingUsecase)
  private toastCustomService = inject(ToastCustomService);
  private readonly printersUseCase = inject(PrintersUseCase);
  private readonly permissionService = inject(PermissionService);
  private readonly loadingService = inject(LoadingService);

  @ViewChild(SampleSendingDumpComponent) sampleSendingDumpComponent!: SampleSendingDumpComponent;

  priorities = signal<IIdName[]>([
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' }
  ]);
  mills = signal<IIdName[]>([
    { id: 'M1', name: 'Molino 1' },
    { id: 'M2', name: 'Molino 2' }
  ]);
  shifts = signal<IIdName[]>([
    { id: '02', name: '02' },
    { id: '04', name: '04' },
    { id: '06', name: '06' },
    { id: '08', name: '08' },
    { id: '10', name: '10' },
    { id: '12', name: '12' },
    { id: '14', name: '14' },
    { id: '16', name: '16' },
    { id: '18', name: '18' },
    { id: '20', name: '20' },
    { id: '22', name: '22' },
    { id: '00', name: '00' }
  ]);
  sampleTypes = signal<ISampleType[]>([]);
  suppliers = signal<IsupplierListResponseEntity[]>([]);
  printers = signal<IPrinter[]>([]);
  analysisTypes = signal<IAnalysisTypeResponse[]>([]);
  receptionAction = ReceptionAction;

  constructor() {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  save(params: ICreateSampleSendingParamsEntity){
    this.loadingService.startLoading('general');
    this.sampleSendingUsecase.createSampleSending(params).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((res)=>{
        this.processCreateResponse(res as IGeneralResponse<ISampleReceptionResponseContent | ISampleReceptionResponseContent[] | null>);
      }),
      catchError((err:HttpErrorResponse)=>{
        this.processError(err)
        return of(null)
      }),
      finalize(() => this.loadingService.stopLoading('general'))
    ).subscribe()
  }

  private loadInitialData() {
    this.store
      .select(selectCommonSampleTypes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => this.sampleTypes.set(list));
    this.store
      .select(getAnalysisTypes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => this.analysisTypes.set(list));
    this.store
      .select(getSuppliers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => this.suppliers.set(list));
    this.store.dispatch(getPrintersAction());
    this.store.select(selectCommonPrinters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(list => this.printers.set(list));
  }

  private processResponse(res: IGeneralResponse<unknown>){
    this.toastCustomService.success(res.message ?? SUCCESS_OPERATION_TITLE)
  }

  private processError(err: HttpErrorResponse){
    this.toastCustomService.error(err.error.message ?? ERROR_OPERATION_TITLE);
  }

  private processCreateResponse(res: IGeneralResponse<ISampleReceptionResponseContent | ISampleReceptionResponseContent[] | null>){
    this.processResponse(res);
    const createdArray = this.normalizeCreatedArray(res.data);
    this.handlePostSave(createdArray);
  }

  private normalizeCreatedArray(data: any): ISampleReceptionResponseContent[] {
    const created = data as ISampleReceptionResponseContent[] | ISampleReceptionResponseContent | null;
    if (Array.isArray(created)) return created;
    if (created) return [created];
    return [];
  }

  private handlePostSave(createdArray: ISampleReceptionResponseContent[]): void {
    if (!createdArray.length) {
      this.sampleSendingDumpComponent.clearAllForms();
      return;
    }
    if (!this.canPrintAfterSave()) {
      this.sampleSendingDumpComponent.clearAllForms();
      return;
    }
    this.sampleSendingDumpComponent.askToPrintAfterSave(createdArray);
  }

  private canPrintAfterSave(): boolean {
    return this.permissionService.hasPermission({
      path: '/lims/recepcion-muestras',
      action: ReceptionAction.IMPRIMIR_ETIQUETAS_RECEPCION
    });
  }

  onPrintSamples(params: IPrintParams) {
    this.printersUseCase
      .print(params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response: IGeneralResponse<IPrintResponse>) => this.processPrintResponse(response, params.sampleId)),
        catchError((error: HttpErrorResponse) => {
          this.toastCustomService.error('Error', error?.error?.message || 'Error al imprimir');
          return of(null)
        })
      ).subscribe()
  }

  private processPrintResponse(response: IGeneralResponse<IPrintResponse>, sampleId: string) {
    this.toastCustomService.success(response?.message || 'Impresión enviada');
    this.sampleSendingDumpComponent?.onPrintedSuccess(sampleId);
    if (this.sampleSendingDumpComponent && this.sampleSendingDumpComponent.itemsOnTable().length === 0) {
      this.sampleSendingDumpComponent.clearAllForms();
    }
  }
}
