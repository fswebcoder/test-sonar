import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { TextAreaComponent } from '@/shared/components/form/text-area/text-area.component';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
  viewChild,
  computed
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AddSamplesComponent } from '../components/add-samples/add-samples.component';
import { AddWeightToSampleComponent } from '../components/add-weight-to-sample/add-weight-to-sample.component';
import { CommonModule } from '@angular/common';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { IDepartmentsResponseEntity } from '@/domain/entities/common/departments-response.entity';
import { ICitiesResponseEntity } from '@/domain/entities/common/cities-response.entity';
import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import {
  ISamplesItems,
  ISamplesReceptionParamsEntity
} from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ACCEPT_LABEL_QUESTION_SAVE_SAMPLES } from '@/shared/constants/general.contant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PermissionDirective } from '@/core/directives';
import { ToastCustomService } from '@SV-Development/utilities';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { PrintComponent } from '@/shared/components/print/print.component';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { IPrintBulkParams } from '@/domain/entities/common/printers/print-bulk-params.entity';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { ISampleDisplayItemEntity } from '@/domain/entities/lims/receptions/samples/sample-display-item.entity';
import { IMassiveSamplesBasePayload } from '@/domain/entities/lims/receptions/samples/massive-samples-base-payload.entity';
import { AddMassiveSamplesComponent } from '@/shared/components/add-massive-samples/add-massive-samples.component';

@Component({
  selector: 'svi-reception-sample-dump',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatSelectComponent,
    TableComponent,
    TextAreaComponent,
    ButtonComponent,
    DialogComponent,
    AddSamplesComponent,
    AddMassiveSamplesComponent,
    AddWeightToSampleComponent,
    ConfirmDialogComponent,
    PermissionDirective,
    PrintComponent
  ],
  templateUrl: './reception-sample-dump.component.html',
  styleUrl: './reception-sample-dump.component.scss'
})
export class ReceptionSampleDumpComponent implements OnInit {
  viewChildDialog = viewChild<ConfirmDialogComponent>('confirmDialog');

  form!: FormGroup;
  ICONS = ICONS;
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  private toastService = inject(ToastCustomService);
  path = this.router.url;
  receptionAction = ReceptionAction;
  readonly priorityOptions = [
    { id: '1', name: '(1) Baja' },
    { id: '2', name: '(2) Media' },
    { id: '3', name: '(3) Alta' }
  ];

  visible = signal<boolean>(false);
  massiveVisible = signal<boolean>(false);
  resetForm = signal<boolean>(false);
  resetMassiveForm = signal<boolean>(false);

  private readonly destroyRef = inject(DestroyRef);

  loadingSupplier = input<boolean>(false);
  inputSuppliersList = input<IsupplierListResponseEntity[]>([]);
  departments = input<IDepartmentsResponseEntity[]>([]);
  cities = input<ICitiesResponseEntity[]>([]);
  samplesTypes = input<ISampleType[]>([]);
  printers = input<IPrinter[]>([]);
  weight = input<number | null>(null);
  allowManualWeight = input<boolean>(false);
  isReadingWeight = input<boolean>(false);
  @ViewChild(AddSamplesComponent) addSampleComponent!: AddSamplesComponent;
  @ViewChild(AddMassiveSamplesComponent) addMassiveSampleComponent!: AddMassiveSamplesComponent;

  getCitiesByDepartmentEmit = output<string>();
  public items = signal<ISampleDisplayItemEntity[]>([]);
  selectedProviderShortName = signal<string>('');
  outputSaveSamples = output<ISamplesReceptionParamsEntity>();
  emitPrint = output<IPrintParams>();
  emitPrintBulk = output<IPrintBulkParams>();
  printerModal = signal<boolean>(false);
  sampleToPrint = signal<Omit<IPrintParams, 'count' | 'printerId'>>({} as Omit<IPrintParams, 'count' | 'printerId'>);
  isPrintMode = signal<boolean>(false);
  isBulkPrint = signal<boolean>(false);
  sampleToAddWeight = signal<ISampleDisplayItemEntity | null>(null);
  addWeightDialogVisible = signal<boolean>(false);
  manualWeight = signal<number | null>(null);
  hasAttemptedWeightRead = signal<boolean>(false);

  shouldEnableManualInput = computed(() => {
    return this.hasAttemptedWeightRead() && !this.isReadingWeight() && this.weight() === null;
  });

  massiveSampleTypes = computed(() => {
    return this.samplesTypes().filter(type => !type.autoGenerateCode);
  });

  requestReadWeight = output<void>();
  modalOpened = output<void>();
  modalClosed = output<void>();

  columns: TableColumn[] = [
    {
      field: 'sampleType',
      header: 'Tipo de muestra',
      template: (item: ISampleDisplayItemEntity) => item.sampleType
    },
    {
      field: 'code',
      header: 'Código de la muestra',
      template: (item: ISampleDisplayItemEntity) => item.code
    },
    {
      field: 'sampleWeight',
      header: 'Peso de la muestra',
      template: (item: ISampleDisplayItemEntity) =>
        item.sampleWeight !== null ? `${item.sampleWeight} gr` : 'Sin peso'
    },
    {
      field: 'moistureDetermination',
      header: 'Determinación de humedad',
      type: 'badge',
      badgeText: (item: ISampleDisplayItemEntity) => (item ? 'Sí' : 'No'),
      badgeSeverity: (item: ISampleDisplayItemEntity) => (item ? 'success' : 'danger')
    }
  ];

  private addWeightAction: TableAction = {
    icon: ICONS.SCALE_WEIGHT,
    tooltip: 'Agregar peso',
    severity: EActionSeverity.EDIT,
    action: (item: ISampleDisplayItemEntity) => this.addWeightToSample(item),
    permission: {
      action: this.receptionAction.CREAR_RECEPCION_MUESTRAS,
      path: '/lims/recepcion-muestras'
    }
  };

  private deleteAction: TableAction = {
    icon: ICONS.TRASH,
    tooltip: 'Eliminar',
    severity: EActionSeverity.DELETE,
    action: (item: ISampleDisplayItemEntity) => this.removeSample(item),
    permission: {
      action: this.receptionAction.CREAR_RECEPCION_MUESTRAS,
      path: '/lims/recepcion-muestras'
    }
  };

  private printActions: TableAction[] = [
    {
      icon: ICONS.PRINT,
      tooltip: 'Imprimir',
      severity: EActionSeverity.EDIT,
      action: (item: ISampleDisplayItemEntity) => this.onPrint(item),
      permission: {
        action: this.receptionAction.IMPRIMIR_ETIQUETAS_RECEPCION,
        path: '/lims/recepcion-muestras'
      }
    }
  ];

  tableActions = computed(() => {
    if (this.isPrintMode()) {
      return this.printActions;
    }

    const currentItems = this.items();
    const actions: TableAction[] = [];

    const hasItemsWithoutWeight = currentItems.some(item => item.sampleWeight === null || item.sampleWeight <= 0);
    if (hasItemsWithoutWeight) {
      actions.push({
        ...this.addWeightAction,
        disabled: (item: ISampleDisplayItemEntity) => item.sampleWeight !== null && item.sampleWeight > 0
      });
    }

    actions.push(this.deleteAction);

    return actions;
  });

  get actions(): TableAction[] {
    return this.tableActions();
  }

  get data(): ISampleDisplayItemEntity[] {
    return this.items();
  }

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    this.listenCitiesByDepartment();
    this.listenSupplierChange();
  }

  createForm() {
    this.form = this.formBuilder.group({
      supplier: new FormControl(null, [Validators.required]),
      observation: new FormControl(null, [Validators.maxLength(500)])
    });
  }

  listenSupplierChange() {
    this.form
      .get('supplier')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((supplier: string | null) => {
        this.supplierChange(supplier);
      });
  }

  supplierChange(supplier: string | null) {
    this.items.set([]);
    this.isPrintMode.set(false);
    if (supplier) {
      const shortName = this.inputSuppliersList().find(s => s.id === supplier)?.shortName || '';
      this.selectedProviderShortName.set(shortName);
      this.resetForm.set(false);
    } else {
      this.selectedProviderShortName.set('');
      this.resetForm.set(true);
    }
  }

  onHideDialog() {
    this.visible.set(false);
    this.massiveVisible.set(false);
    this.resetForm.set(true);
    this.resetMassiveForm.set(true);
    this.modalClosed.emit();
  }

  onOpenModal() {
    this.resetForm.set(false);
    this.visible.set(true);
    this.modalOpened.emit();
  }

  onOpenMassiveModal() {
    this.resetMassiveForm.set(false);
    this.massiveVisible.set(true);
  }

  listenCitiesByDepartment() {
    this.form
      .get('department')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(departmentId => {
        if (departmentId) {
          this.getCitiesByDepartment(departmentId);
        }
      });
  }

  getCitiesByDepartment(departmentId: string) {
    this.getCitiesByDepartmentEmit.emit(departmentId);
  }

  onAddSamples(sample: ISamplesItems) {
    const existingSample = this.items().find(item => item.code === sample.code);

    if (existingSample) {
      this.toastService.error(
        'Código duplicado',
        `Ya existe una muestra con el código "${sample.code}". No se pueden agregar muestras con códigos repetidos.`
      );
      return;
    }

    this.visible.set(false);
    const newSample = {
      sampleType: this.samplesTypes().find(type => type.id === sample.sampleTypeId)?.name || '',
      code: sample.code,
      sampleWeight: sample.receivedWeight,
      sampleTypeId: sample.sampleTypeId,
      moistureDetermination: sample.moistureDetermination
    };

    this.items.update(items => [...items, newSample]);
    this.addSampleComponent?.resetFormCompletely();
  }

  onAddMassiveSamples(payload: IMassiveSamplesBasePayload) {
    const { sampleTypeId, prefix, rangeStart, rangeEnd, moistureDetermination } = payload;
    const sampleTypeName = this.samplesTypes().find(type => type.id === sampleTypeId)?.name || '';
    const newSamples: ISampleDisplayItemEntity[] = [];

    for (let i = rangeStart; i <= rangeEnd; i++) {
      const code = `${prefix}${i}`;
      const existingSample = this.items().find(item => item.code === code);

      if (existingSample) {
        this.toastService.warn('Código duplicado', `La muestra con código "${code}" ya existe y se omitió.`);
        continue;
      }

      newSamples.push({
        sampleType: sampleTypeName,
        code: code,
        sampleWeight: null,
        sampleTypeId: sampleTypeId,
        moistureDetermination: moistureDetermination ?? false
      });
    }

    if (newSamples.length > 0) {
      this.items.update(items => [...items, ...newSamples]);
      this.massiveVisible.set(false);
      this.addMassiveSampleComponent?.resetFormCompletely();
      this.toastService.success('Muestras generadas', `Se generaron ${newSamples.length} muestras exitosamente`);
    }
  }

  addWeightToSample(sample: ISampleDisplayItemEntity) {
    if (sample.sampleWeight !== null && sample.sampleWeight > 0) return;
    this.sampleToAddWeight.set(sample);
    this.manualWeight.set(null);
    this.hasAttemptedWeightRead.set(false);
    this.modalOpened.emit();
    this.addWeightDialogVisible.set(true);
  }

  saveWeightToSample() {
    const sample = this.sampleToAddWeight();
    const scaleWeight = this.weight();
    const manual = this.manualWeight();
    const finalWeight = scaleWeight ?? manual;

    if (!sample || finalWeight === null || finalWeight <= 0) {
      this.toastService.error('Error', 'Debe ingresar un peso válido mayor a 0');
      return;
    }

    this.items.update(items =>
      items.map(item => (item.code === sample.code ? { ...item, sampleWeight: finalWeight } : item))
    );

    this.cancelAddWeight();
    this.toastService.success('Peso agregado', `Se agregó ${finalWeight} gr a la muestra ${sample.code}`);
  }

  cancelAddWeight() {
    this.addWeightDialogVisible.set(false);
    this.sampleToAddWeight.set(null);
    this.manualWeight.set(null);
    this.hasAttemptedWeightRead.set(false);
    this.modalClosed.emit();
  }

  removeSample(sample: ISampleDisplayItemEntity) {
    this.viewChildDialog()?.show(
      `¿Está seguro que desea eliminar la muestra "${sample.code}"?`,
      () => {
        this.items.update(items => items.filter(item => item.code !== sample.code));
      },
      () => {}
    );
  }

  validateForm() {
    const samplesWithoutWeight = this.items().filter(item => item.sampleWeight === null || item.sampleWeight <= 0);

    if (samplesWithoutWeight.length > 0) {
      this.toastService.error(
        'Muestras sin peso válido',
        `Hay ${samplesWithoutWeight.length} muestra(s) sin peso o con peso inválido (debe ser mayor a 0). Por favor, agregue un peso válido a todas las muestras antes de guardar.`
      );
      return;
    }

    if (this.form.valid) {
      this.viewChildDialog()?.show(
        ACCEPT_LABEL_QUESTION_SAVE_SAMPLES,
        () => {
          const params = this.generateParams();
          this.outputSaveSamples.emit(params);
        },
        () => {}
      );
    }
  }

  generateParams(): ISamplesReceptionParamsEntity {
    console.log(this.items());
    const transformedItems: ISamplesItems[] = this.items().map(item => ({
      sampleTypeId: item.sampleTypeId,
      code: item.code,
      receivedWeight: item.sampleWeight !== null ? Number(item.sampleWeight) : null,
      moistureDetermination: item.moistureDetermination
    }));

    return {
      supplierId: this.form.get('supplier')?.value,
      observation: this.form.get('observation')?.value ?? '',
      samples: transformedItems
    };
  }

  onCancel() {
    this.visible.set(false);
    this.massiveVisible.set(false);
    this.resetForm.set(true);
    this.resetMassiveForm.set(true);
  }

  clearAll() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.items.set([]);
    this.resetForm.set(true);
    this.isPrintMode.set(false);
    this.printerModal.set(false);
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
    this.items.update(items =>
      items.map(item => {
        const original = norm(item.code);
        const id = mapByCode.get(original) || mapByCode.get(original + 'r') || mapByCode.get(original + 'R');
        if (id) matched++;
        return { ...item, sampleId: id ?? item.sampleId };
      })
    );

    if (matched === 0 && created.length > 0) {
      this.toastService.error('No se asignaron IDs', 'No se encontraron coincidencias de códigos para imprimir');
    }
  }

  onPrint(item: ISampleDisplayItemEntity) {
    if (!item?.sampleId) return;
    this.sampleToPrint.set({ sampleId: item.sampleId });
    this.printerModal.set(true);
  }

  onPrintVisibleChange(visible: boolean) {
    this.printerModal.set(visible);
    if (!visible) {
      this.isBulkPrint.set(false);
    }
  }

  onPrintBulk() {
    this.isBulkPrint.set(true);
    this.sampleToPrint.set({ sampleId: '' });
    this.printerModal.set(true);
  }

  onPrintSample(params: IPrintParams) {
    if (this.isBulkPrint()) {
      const bulkParams: IPrintBulkParams = {
        printerId: params.printerId,
        count: params.count,
        sampleIds: this.items()
          .map(item => item.sampleId)
          .filter((id): id is string => !!id)
      };
      this.emitPrintBulk.emit(bulkParams);
    } else {
      this.emitPrint.emit(params);
    }
    this.printerModal.set(false);
    this.isBulkPrint.set(false);
  }

  onPrintCancel() {
    this.printerModal.set(false);
    this.isBulkPrint.set(false);
  }

  onPrintedSuccess(sampleId: string) {
    this.items.update(items => items.filter(item => item.sampleId !== sampleId));
  }

  get getCancelLabel() {
    return this.isPrintMode() ? 'Limpiar muestras' : 'Cancelar';
  }

  handleReadWeightRequest() {
    this.hasAttemptedWeightRead.set(true);
    this.requestReadWeight.emit();
  }

  onManualWeightChange(weight: number | null) {
    this.manualWeight.set(weight);
  }
}
