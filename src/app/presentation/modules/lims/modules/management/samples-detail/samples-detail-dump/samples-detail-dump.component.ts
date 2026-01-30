import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { AnalysisResultsContentComponent } from '../components/analysis-results-content/analysis-results-content.component';
import { SampleDetailsGeneralInformationComponent } from '../components/sample-details-general-information/sample-details-general-information.component';
import { SampleDetailsMetricsComponent } from '../components/sample-details-metrics/sample-details-metrics.component';
import { SampleDetailsMainContentComponent } from '../components/sample-details-main-content/sample-details-main-content.component';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { PrintComponent } from '@/shared/components/print/print.component';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { PermissionDirective } from '@/core/directives';
import ISampleDetailEntity from '@/domain/entities/lims/management/sample-detail.entity';
import ISampleDetailRequiredAnalysesEntity from '@/domain/entities/lims/management/sample-detail-required-analyses.entity';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { DuplicateSampleFormComponent } from '../components/duplicate-sample-form/duplicate-sample-form.component';
import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';

@Component({
  selector: 'svi-samples-detail-dump',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    TimelineModule,
    ChipModule,
    TooltipModule,
    AvatarModule,
    TagModule,
    DialogComponent,
    AnalysisResultsContentComponent,
    SampleDetailsGeneralInformationComponent,
    SampleDetailsMetricsComponent,
    SampleDetailsMainContentComponent,
    BackButtonComponent,
    PrintComponent,
    PermissionDirective,
    DuplicateSampleFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './samples-detail-dump.component.html',
  styleUrl: './samples-detail-dump.component.scss'
})
export class SamplesDetailDumpComponent {
  sampleDetail = input.required<ISampleDetailEntity>();
  printers = input.required<IPrinter[]>();
  duplicateLoading = input<boolean>(false);
  showCreateSupplierDialog = signal(false);
  showResultsModal = signal(false);
  selectedAnalysis = signal<any>(null);
  printerModal = signal(false);
  sampleToPrint = signal<Omit<IPrintParams, 'count' | 'printerId'>>({} as IPrintParams);
  onPrint = output<IPrintParams>();
  onPrintBulk = output<IPrintBulkParams>();
  onDuplicateSample = output<IRepeateSampleParamsEntity>();
  isBulkPrint = signal<boolean>(false);

  path = '/lims/gestion-muestras';
  ReceptionAction = ReceptionAction;

  @ViewChild('printComponent') printComponent!: PrintComponent;
  @ViewChild(DuplicateSampleFormComponent) duplicateDialog?: DuplicateSampleFormComponent;
  @ViewChild('printConfirmDialog') printConfirmDialog?: ConfirmDialogComponent;

  onCloseResultsModal(visible?: boolean): void {
    if (visible === false || visible === undefined) {
      this.showResultsModal.set(false);
      this.selectedAnalysis.set(null);
    }
  }

  onSelectResult(analysis: ISampleDetailRequiredAnalysesEntity): void {
    this.selectedAnalysis.set(analysis);
    this.showResultsModal.set(true);
  }

  showPrintDialog(quarteringId: string): void {
    this.sampleToPrint.set({
      sampleId: quarteringId
    });
    this.printerModal.set(true);
  }

  showPrintBulkDialog(): void {
    this.isBulkPrint.set(true);
    this.sampleToPrint.set({ sampleId: '' });
    this.printerModal.set(true);
  }

  openDuplicateDialog(): void {
    this.duplicateDialogVisible.set(true);
  }

  closeDuplicateDialog(): void {
    this.duplicateDialogVisible.set(false);
    this.duplicateDialog?.resetForm();
  }

  handleDuplicateDialogVisibleChange(visible: boolean): void {
    this.duplicateDialogVisible.set(visible);
    if (!visible) {
      this.duplicateDialog?.resetForm();
    }
  }

  handleDuplicateSave(payload: Pick<IRepeateSampleParamsEntity, 'receivedWeight' | 'moistureDetermination'>): void {
    const sample = this.sampleDetail();
    const sampleId = sample.sampleId;
    if (!sampleId) {
      return;
    }

    this.onDuplicateSample.emit({
      sampleId,
      receivedWeight: Number(payload.receivedWeight),
      moistureDetermination: payload.moistureDetermination
    });
  }

  askPrintDuplicatedSample(sample: ISampleReceptionResponseContent): void {
    const code = sample.sampleCode || sample.sampleId;
    this.printConfirmDialog?.show(
      `¿Deseas imprimir la muestra duplicada ${code}?`,
      () => this.showPrintDialog(sample.sampleId),
      () => {}
    );
  }

  duplicateDialogVisible = signal(false);

  onPrintVisibleChange(visible: boolean): void {
    this.printerModal.set(visible);
    if (!visible) {
      this.isBulkPrint.set(false);
    }
  }

  print(params: IPrintParams): void {
    if (this.isBulkPrint()) {
      const quarterings = this.sampleDetail().quartering || [];
      const bulkParams: IPrintBulkParams = {
        printerId: params.printerId,
        count: params.count,
        sampleIds: quarterings.map(q => q.id).filter((id): id is string => !!id)
      };
      this.onPrintBulk.emit(bulkParams);
    } else {
      this.onPrint.emit(params);
    }
    this.printerModal.set(false);
    this.isBulkPrint.set(false);
  }

  cancelPrint(): void {
    this.printerModal.set(false);
    this.isBulkPrint.set(false);
    this.printComponent.resetForm();
  }

  get defaultReceivedWeight(): number | null {
    const raw = this.sampleDetail().receivedWeight;
    if (raw === undefined || raw === null) {
      return null;
    }

    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
