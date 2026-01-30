import { LoadingService } from '@shared/services/loading.service';
import { Component, DestroyRef, ViewChild, inject, OnInit, signal } from '@angular/core';
import { ReceptionSampleDumpComponent } from '../reception-sample-dump/reception-sample-dump.component';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { catchError, lastValueFrom, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommonCities } from '@/store/selectors/common/common.selectors';
import { GlobalListsService } from '@/shared/services/global-lists.service';
import { IDepartmentsResponseEntity } from '@/domain/entities/common/departments-response.entity';
import { ICitiesResponseEntity } from '@/domain/entities/common/cities-response.entity';
import { CatalogsUseCases } from '@/domain/use-cases/common/catalogs.usecases';
import { CommonModule } from '@angular/common';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { MessagesModule } from 'primeng/messages';
import { LOAD_DATA_ERROR_TITLE, UNEXPECTED_ERROR_TITLE } from '@/shared/constants/general.contant';
import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { SamplesUseCase } from '@/domain/use-cases/lims/samples/samples.usecase';
import { ISamplesReceptionParamsEntity } from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { getCitiesAction, getPrintersAction } from '@/store/actions/common/common.action';
import { IDefaultAnalysisResponse } from '@/domain/entities/lims/analysis/default-analysis-response.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { viewChild } from '@angular/core';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { selectCommonPrinters } from '@/store/selectors/common/common.selectors';
import { PrintersUseCase } from '@/domain/use-cases/common/printers.usecase';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { IPrintResponse } from '@/domain/entities/common/printers/print-response.entity';
import { PermissionService } from '@/core/services';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { SampleScaleUsecase } from '@/domain/use-cases/lims/sample-scale/sample-scale.usecase';
import { ESampleScales } from '@/shared/enums/sample-scales.enum';
import { IReadScaleResponseEntity } from '@/domain/entities/lims/sample-scale/read-scale-response.entity';

@Component({
  selector: 'svi-reception-sample-smart',
  standalone: true,
  imports: [ReceptionSampleDumpComponent, CommonModule, MessagesModule, ConfirmDialogComponent],
  templateUrl: './reception-sample-smart.component.html',
  styleUrl: './reception-sample-smart.component.scss'
})
export class ReceptionSampleSmartComponent implements OnInit {
  confirmDialog = viewChild<ConfirmDialogComponent>('confirmAfterSaveDialog');
  private loadingService = inject(LoadingService);
  private readonly catalogsUseCases = inject(CatalogsUseCases);
  private globalListsService = inject(GlobalListsService);
  private toastCustomService = inject(ToastCustomService);
  private samplesUseCase = inject(SamplesUseCase);
  private store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly printersUseCase = inject(PrintersUseCase);
  private readonly permissionService = inject(PermissionService);
  private readonly sampleScaleUseCase = inject(SampleScaleUsecase);
  departments = signal<IDepartmentsResponseEntity[]>([]);
  cities = signal<ICitiesResponseEntity[]>([]);
  citiesByDepartment = signal<ICitiesResponseEntity[]>([]);
  suppliers = signal<IsupplierListResponseEntity[]>([]);
  samplesTypes = signal<ISampleType[]>([]);
  analysisTypes = signal<IAnalysisTypeResponse[]>([]);
  readonly defaultAnalisys = signal<IDefaultAnalysisResponse[]>([]);
  printers = signal<IPrinter[]>([]);
  weight = signal<number | null>(null);
  allowManualWeight = signal(false);
  isReadingWeight = signal(false);
  @ViewChild(ReceptionSampleDumpComponent) dumpComponent?: ReceptionSampleDumpComponent;

  ngOnInit(): void {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.departments.set(this.globalListsService.departments());
      this.store.dispatch(getCitiesAction());
      this.store
        .select(selectCommonCities)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cities => {
          if (cities && cities.length > 0) {
            this.cities.set(cities);
          }
        });

      this.samplesTypesQuery.refetch();
      this.analysisTypesQuery.refetch();
      await this.suppliersQuery.refetch();
      this.store.dispatch(getPrintersAction());
      this.store
        .select(selectCommonPrinters)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(list => this.printers.set(list));
    } catch (error) {
      this.toastCustomService.error('Error', LOAD_DATA_ERROR_TITLE);
    }
  }

  suppliersQuery = injectQuery(() => ({
    queryKey: ['suppliers'],
    queryFn: () =>
      lastValueFrom(this.catalogsUseCases.execute('SUPPLIERS')).then(result => {
        if (!result?.data) {
          this.toastCustomService.error('Error', LOAD_DATA_ERROR_TITLE);
        }
        this.suppliers.set(Array.isArray(result.data) ? result.data : [result.data]);
        return result;
      })
  }));

  samplesTypesQuery = injectQuery(() => ({
    queryKey: ['samplesTypes'],
    queryFn: () =>
      lastValueFrom(this.catalogsUseCases.execute('SAMPLE_TYPES')).then(result => {
        if (!result?.data) {
          this.toastCustomService.error('Error', LOAD_DATA_ERROR_TITLE);
        }
        this.samplesTypes.set(Array.isArray(result.data) ? result.data : [result.data]);
        return result;
      })
  }));

  analysisTypesQuery = injectQuery(() => ({
    queryKey: ['analysisTypes'],
    queryFn: () =>
      lastValueFrom(this.catalogsUseCases.execute('ANALYSIS_TYPES')).then(result => {
        if (!result?.data) {
          this.toastCustomService.error('Error', LOAD_DATA_ERROR_TITLE);
        }
        this.analysisTypes.set(Array.isArray(result.data) ? result.data : [result.data]);
        return result;
      })
  }));

  saveSamples = (params: ISamplesReceptionParamsEntity) => {
    this.loadingService.startLoading('general');
    this.samplesUseCase
      .create(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          if (response?.statusCode === 201) {
            this.toastCustomService.success('Guardado', response?.message || 'Muestras guardadas correctamente');
            const createdArray = this.normalizeCreatedArray(response.data);
            this.handlePostSave(createdArray);
            this.loadingService.stopLoading('general');
          }
        },
        error: error => {
          this.toastCustomService.error('Error', error.error.message || 'Error saving samples');
          this.loadingService.stopLoading('general');
        }
      });
  };

  private normalizeCreatedArray(data: any): ISampleReceptionResponseContent[] {
    const created = data as ISampleReceptionResponseContent[] | ISampleReceptionResponseContent | null;
    if (Array.isArray(created)) return created;
    if (created) return [created];
    return [];
  }

  private handlePostSave(createdArray: ISampleReceptionResponseContent[]): void {
    if (!createdArray.length) {
      this.clearDump();
      return;
    }

    if (!this.canPrintAfterSave()) {
      this.clearDump();
      return;
    }

    this.askToPrintAfterSave(createdArray);
  }

  private canPrintAfterSave(): boolean {
    return this.permissionService.hasPermission({
      path: '/lims/recepcion-muestras',
      action: ReceptionAction.IMPRIMIR_ETIQUETAS_RECEPCION
    });
  }

  private clearDump(): void {
    this.dumpComponent?.clearAll();
  }

  private askToPrintAfterSave(created: ISampleReceptionResponseContent[]) {
    this.confirmDialog()?.show(
      '¿Desea imprimir las muestras creadas?',
      () => this.enablePrintMode(created),
      () => this.clearDump()
    );
  }

  private enablePrintMode(created: ISampleReceptionResponseContent[]) {
    const dump = this.getDumpComponent();
    if (!dump) return;
    dump.assignCreatedSampleIds(created);
    dump.setPrintMode(true);
  }

  onPrintSamples(params: IPrintParams) {
    this.loadingService.setButtonLoading('loading-print-sample-button', true);
    this.printersUseCase
      .print(params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(response => this.processPrintResponse(response, params.sampleId)),
        catchError((error: HttpErrorResponse) => {
          this.loadingService.setButtonLoading('loading-print-sample-button', false);
          return [];
        })
      )
      .subscribe();
  }

  onPrintBulkSamples(params: IPrintBulkParams) {
    this.loadingService.setButtonLoading('loading-print-bulk-sample-button', true);
    this.printersUseCase
      .printBulk(params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(response => this.processPrintBulkResponse(response, params.sampleIds)),
        catchError((error: HttpErrorResponse) => {
          this.loadingService.setButtonLoading('loading-print-bulk-sample-button', false);
          return [];
        })
      )
      .subscribe();
  }

  private processPrintResponse = (response: IGeneralResponse<IPrintResponse>, sampleId: string) => {
    this.toastCustomService.success(response?.message || 'Impresión enviada');
    this.loadingService.setButtonLoading('loading-print-sample-button', false);
    this.dumpComponent?.onPrintedSuccess(sampleId);
    if (this.dumpComponent && this.dumpComponent.data.length === 0) {
      this.dumpComponent.clearAll();
    }
  };

  private processPrintBulkResponse = (response: IGeneralResponse<void>, sampleIds: string[]) => {
    this.toastCustomService.success(response?.message || 'Impresión masiva enviada');
    this.loadingService.setButtonLoading('loading-print-bulk-sample-button', false);

    sampleIds.forEach(id => this.dumpComponent?.onPrintedSuccess(id));

    if (this.dumpComponent && this.dumpComponent.data.length === 0) {
      this.dumpComponent.clearAll();
    }
  };

  private getDumpComponent(): ReceptionSampleDumpComponent | null {
    return this.dumpComponent ?? null;
  }

  get isLoadingSuppliers(): boolean {
    return this.suppliersQuery.status() === 'pending';
  }

  get hasError(): boolean {
    return this.suppliersQuery.status() === 'error';
  }

  get errorMessage(): string {
    const error = this.suppliersQuery.error();
    return error instanceof Error ? error.message : UNEXPECTED_ERROR_TITLE;
  }

  getCitiesByDepartment(departmentId: string) {
    const cities = this.cities().filter(city => city.departmentId === departmentId);
    this.citiesByDepartment.set(cities);
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
      this.weight.set(readWeight);
      const enableManual = readWeight === null;
      this.allowManualWeight.set(enableManual);
      if (enableManual) {
        this.toastCustomService.info('La báscula no devolvió un peso. Ingrese el valor manualmente.');
      }
    } catch (error) {
      this.allowManualWeight.set(true);
      this.toastCustomService.error('No fue posible leer el peso desde la báscula. Intente nuevamente.');
    } finally {
      this.isReadingWeight.set(false);
    }
  }

  onAddSampleModalOpened(): void {
    this.resetWeightState();
  }

  onAddSampleModalClosed(): void {
    this.resetWeightState();
  }

  private resetWeightState(): void {
    this.weight.set(null);
    this.allowManualWeight.set(false);
    this.isReadingWeight.set(false);
  }
}
