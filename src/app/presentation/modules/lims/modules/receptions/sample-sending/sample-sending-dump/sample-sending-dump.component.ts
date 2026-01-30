import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { Component, DestroyRef, inject, input, OnInit, output, signal, ViewChild, viewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { AddSamplesComponent } from '../components/add-sample.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { IIdName } from '@/shared/interfaces/id-name.interface';
import { ButtonComponent } from '@shared/components/form/button/button.component';
import { ICONS } from '@shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import {
  ICreateSampleSendingParamsEntity,
  ISendingSampleItemEntity
} from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-params.entity';
import { ToastCustomService } from '@SV-Development/utilities';
import { TableAction, TableColumn, TableComponent } from '@shared/components/table/table.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { PrintComponent } from '@/shared/components/print/print.component';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";

@Component({
  selector: 'svi-sample-sending-dump',
  templateUrl: './sample-sending-dump.component.html',
  imports: [
    DialogComponent,
    AddSamplesComponent,
    FloatSelectComponent,
    FloatInputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    TableComponent,
    ConfirmDialogComponent,
    PrintComponent,
    EmptyStateComponent
]
})
export class SampleSendingDumpComponent implements OnInit {
  suppliers = input.required<IsupplierListResponseEntity[]>();
  priorities = input.required<IIdName[]>();
  sampleTypes = input.required<ISampleType[]>();
  mills = input.required<IIdName[]>();
  shifts = input.required<IIdName[]>();
  printers = input<IPrinter[]>([]);
  analysisTypes = input.required<IAnalysisTypeResponse[]>();

  onSave = output<ICreateSampleSendingParamsEntity>();
  emitPrint = output<IPrintParams>();

  isAddSampleOpen = signal<boolean>(false);
  selectedSupplier = signal<IsupplierListResponseEntity | null>(null);
  itemsOnTable = signal<ISendingSampleItemEntity[]>([]);
  printerModal = signal<boolean>(false);
  sampleToPrint = signal<Omit<IPrintParams, 'count' | 'printerId'>>({} as Omit<IPrintParams, 'count' | 'printerId'>);
  isPrintMode = signal<boolean>(false);
  receptionAction = ReceptionAction;

  toastCustomService = inject(ToastCustomService);
  private readonly destroyRef = inject(DestroyRef);
  confirmDialogRef = viewChild<ConfirmDialogComponent>('confirmDialog');

  @ViewChild(AddSamplesComponent) addSampleComponent!: AddSamplesComponent;

  form!: FormGroup;
  ICONS = ICONS;

  path = '/lims/envio-de-muestras'

  columns: TableColumn[] = [
    {
      header: 'Código',
      field: 'code'
    },
    {
      header: 'Tipo de muestra',
      field: 'sampleTypeId',
      template: (sample: ISendingSampleItemEntity): string => {
        const sampleType = this.sampleTypes().find(x => x.id === sample.sampleTypeId);
        return sampleType?.name || '';
      }
    },
    {
      header: 'Análisis',
      field: 'requiredAnalyses',
      template: (sample: ISendingSampleItemEntity): string =>
        `${sample.requiredAnalyses?.length ?? 0}`
    }
  ];

  cancelAddSample() {
    this.closeAllDialogs();
    this.clearAddSampleComponent();
  }

  private deleteActions: TableAction[] = [
    {
      icon: ICONS.TRASH,
        tooltip: 'Eliminar',
  severity: EActionSeverity.DELETE,
      action: (item: ISendingSampleItemEntity) => this.removeSampleFromTableWithConfirm(item),
      permission: {
        action: this.receptionAction.CREAR_ENVIO_DE_MUESTRAS,
        path: this.path
      }
    }
  ];

  private printActions: TableAction[] = [
    {
      icon: ICONS.PRINT,
        tooltip: 'Imprimir',
  severity: EActionSeverity.EDIT,
      action: (item: ISendingSampleItemEntity) => this.onPrint(item),
      permission: {
        action: this.receptionAction.CREAR_ENVIO_DE_MUESTRAS,
        path: this.path
      }
    }
  ];

  get actions(): TableAction[] {
    return this.isPrintMode() ? this.printActions : this.deleteActions;
  }

  get data(): ISendingSampleItemEntity[] {
    return this.itemsOnTable();
  }
  ngOnInit() {
    this.createForm();
    this.listenToSupplierChanges();
  }

  clearAllForms() {
    const samplesFA = this.form.get('samples') as FormArray;
    samplesFA.clear();
    this.form.reset();
    this.itemsOnTable.set([]);
    this.addSampleComponent.clearForm();
    this.isPrintMode.set(false);
    this.printerModal.set(false);
  }

  clearAddSampleComponent() {
    this.closeAllDialogs();
    this.addSampleComponent.clearForm();
  }

  addSampleToTable(sample: ISendingSampleItemEntity) {
    const cloned = this.cloneSample(sample);
    this.itemsOnTable.update(lv => [...lv, cloned]);
    const samplesFA = this.form.get('samples') as FormArray;
    samplesFA.push(new FormControl(this.cloneSample(sample)));
  }

  removeSampleFromTable(code: string) {
    this.itemsOnTable.update(lv => lv.filter(x => x.code != code));
    const samplesFA = this.form.get('samples') as FormArray;
    const idx = samplesFA.value.findIndex((s: ISendingSampleItemEntity) => s.code === code);
    if (idx > -1) samplesFA.removeAt(idx);
  }

  removeSampleFromTableWithConfirm(item: ISendingSampleItemEntity) {
    this.confirmDialogRef()?.show(
      `¿Está seguro que desea eliminar la muestra "${item.code}"?`,
      () => this.removeSampleFromTable(item.code),
      () => {}
    );
  }

  addSample(sample: ISendingSampleItemEntity) {
    if (this.findSampleOnRegisters(sample.code)) {
      this.toastCustomService.error('La muestra ya fué registrada anteriormente, prueba con otra');
      return;
    }
    this.addSampleToTable(sample);
    this.toastCustomService.success('Muestra agregada exitosamente');
    this.clearAddSampleComponent();
  }

  openAddSampleDialog() {
    this.isAddSampleOpen.set(true);
  }

  closeAllDialogs() {
    this.isAddSampleOpen.set(false);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAsTouched();
      return;
    }
    this.confirmDialogRef()?.show(
      '¿Está seguro que desea guardar las muestras registradas?',
      () => this.onSave.emit(this.form.value),
      () => {}
    );
  }

  get isAvailableToOpenModal(): boolean {
    const control = this.form.get('supplierId');
    return control ? control.valid : false;
  }

  private findSampleOnRegisters(code: string): boolean {
    const samplesFA = this.form.get('samples') as FormArray;
    const registers: ISendingSampleItemEntity[] = samplesFA.value;
    return registers.some(x => code === x.code);
  }

  private listenToSupplierChanges() {
    this.form
      .get('supplierId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((supplierId: string) => {
        const selected = this.suppliers().find(x => x.id === supplierId) || null;
        this.selectedSupplier.set(selected);
        this.isPrintMode.set(false);
        this.printerModal.set(false);
      });
  }

  private createForm() {
    this.form = new FormGroup({
      samples: new FormArray([]),
      supplierId: new FormControl(null, [Validators.required]),
      carrier: new FormControl(null),
      priority: new FormControl(null)
    });
  }

  private cloneSample(sample: ISendingSampleItemEntity): ISendingSampleItemEntity {
    const clonedAnalyses = typeof globalThis.structuredClone === 'function'
      ? globalThis.structuredClone(sample.requiredAnalyses ?? [])
      : JSON.parse(JSON.stringify(sample.requiredAnalyses ?? []));
    return {
      ...sample,
      requiredAnalyses: clonedAnalyses
    };
  }

  setPrintMode(enable: boolean) {
    this.isPrintMode.set(enable);
  }

  assignCreatedSampleIds(created: ISampleReceptionResponseContent[]) {
    const norm = (v: string) => (v ?? '').toString().trim().toLowerCase();

    const mapByCode = new Map<string, string>();
    for (const c of created) {
      const raw = (c.sampleCode ?? '').toString().trim();
      const code = norm(raw);
      if (!code) continue;
      mapByCode.set(code, c.sampleId);
      if (/r$/i.test(raw)) {
        const withoutSuffix = norm(raw.slice(0, -1));
        mapByCode.set(withoutSuffix, c.sampleId);
      }
    }

    let matched = 0;
    this.itemsOnTable.update(items =>
      items.map(item => {
        const original = norm(item.code);
        const id = mapByCode.get(original) || mapByCode.get(original + 'r') || mapByCode.get(original + 'R');
        if (id) matched++;
        return { ...item, sampleId: id ?? (item as any).sampleId };
      })
    );

    if (matched === 0 && created.length > 0) {
      this.toastCustomService.error('No se asignaron IDs', 'No se encontraron coincidencias de códigos para imprimir');
    }
  }

  onPrint(item: any) {
    if (!item?.sampleId) return;
    this.sampleToPrint.set({ sampleId: item.sampleId });
    this.printerModal.set(true);
  }

  onPrintVisibleChange(visible: boolean) {
    this.printerModal.set(visible);
  }

  onPrintSample(params: IPrintParams) {
    this.emitPrint.emit(params);
  }

  onPrintCancel() {
    this.printerModal.set(false);
  }

  onPrintedSuccess(sampleId: string) {
    this.itemsOnTable.update(items => items.filter(item => (item as any).sampleId !== sampleId));
  }

  askToPrintAfterSave(created: ISampleReceptionResponseContent[]) {
    this.confirmDialogRef()?.show(
      '¿Desea imprimir las muestras creadas?',
      () => {
        this.assignCreatedSampleIds(created);
        this.setPrintMode(true);
      },
      () => this.clearAllForms()
    );
  }

  get getCancelLabel(): string {
    return this.isPrintMode() ? 'Limpiar muestras' : 'Cancelar';
  }
}
