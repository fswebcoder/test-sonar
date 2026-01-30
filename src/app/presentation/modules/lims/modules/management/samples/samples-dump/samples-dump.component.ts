import { ISampleEntity } from '@/domain/entities/lims/management/sample.entity';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { SampleCardComponent } from '../components/sample-card/sample-card.component';
import { DatePikerComponent } from '@/shared/components/form/date-piker/date-piker.component';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { formatDate } from '@/core/utils/format-date';
import { getActualMonthRange } from '@/core/utils/get-actual-month-range';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { PrintComponent } from '@/shared/components/print/print.component';
import { IPrinter } from '@/domain/entities/common/printers/printers.entity';
import { IPrintParams } from '@/domain/entities/common/printers/print-params.entity';
import { ISamplesDropdownEntity } from '@/domain/entities/lims/management/samples-dropdown.entity';
import { FloatMultiselectComponent } from '@shared/components/form/multiselect/multiselect.component';
import { IIdName } from '@/shared/interfaces/id-name.interface';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { SampleExpandedContentComponent } from '../components/sample-expanded-content/sample-expanded-content.component';
import { ViewSwitcherComponent } from '@/shared/components/view-switcher/view-switcher.component';
import { PaginatedData, TPaginationParams } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { debounceTime } from 'rxjs';
import { SampleStatus } from '@/shared/enums/sample-status.enum';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { PermissionDirective } from '@/core/directives';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-samples-dump',
  imports: [
    CommonModule,
    SampleCardComponent,
    DatePikerComponent,
    EmptyStateComponent,
    ReactiveFormsModule,
    PaginatorComponent,
    DialogComponent,
    PrintComponent,
    FloatMultiselectComponent,
    FormsModule,
    TableComponent,
    TableModule,
    SampleExpandedContentComponent,
    ViewSwitcherComponent,
    FloatInputComponent,
    PermissionDirective
  ],
  templateUrl: './samples-dump.component.html',
  styleUrl: './samples-dump.component.scss'
})
export class SamplesDumpComponent {
  @ViewChild('printComponent') printComponent!: PrintComponent;
  samplesDropdown = input<ISamplesDropdownEntity>();
  data = input<PaginatedData<ISampleEntity>>();
  printers = input<IPrinter[]>();
  sampleToPrint = signal<Pick<IPrintParams, 'sampleId'>>({} as Pick<IPrintParams, 'sampleId'>);

  private readonly router = inject(Router);

  onParamsChange = output<TPaginationParams>();
  emitPrint = output<IPrintParams>();

  suppliersDropdownMultiselect = computed(() => this.samplesDropdown()?.suppliers || ([] as IIdName[]));
  sampleTypesDropdownMultiselect = computed(() => this.samplesDropdown()?.sampleTypes || ([] as IIdName[]));
  sampleStatusDropdownMultiselect = computed(() => this.samplesDropdown()?.statuses || ([] as IIdName[]));

  private readonly paginationService = inject(PaginationService);
  private readonly fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  ReceptionAction = ReceptionAction;

  printerModal = signal<boolean>(false);
  viewMode = signal<string>('table');

  viewOptions = computed(() => [
    { value: 'table', label: 'Tabla', icon: 'pi pi-bars' },
    { value: 'cards', label: 'Tarjetas', icon: 'pi pi-table' }
  ]);

  form!: FormGroup;

  columns: TableColumn[] = [
    { field: 'sampleCode', header: 'Código', width: '15%' },
    { field: 'receptionDate', header: 'Fecha de Recepción', width: '20%', type: 'date' },
    {
      field: 'supplierName',
      header: 'Proveedor',
      width: '25%',
      permission: { path: '/lims/gestion-muestras', action: ReceptionAction.VER_PROVEEDOR_GESTION_MUESTRAS }
    },
    { field: 'sampleTypeName', header: 'Tipo de Muestra', width: '20%' },
    {
      field: 'status',
      header: 'Estado',
      width: '20%',
      template: (sample: ISampleEntity) => this.getStatusBadge(sample),
      isHtml: true
    },
    {
      field: 'receivedWeight',
      header: 'Peso Recibido',
      width: '20%',
      template: (sample: ISampleEntity) =>
        `${Number(sample.receivedWeight).toLocaleString('es-CO')} ${EWeightUnits.GRAMS}`
    }
  ];

  actions: TableAction[] = [
    {
      icon: ICONS.PRINT,
      tooltip: 'Imprimir Etiqueta',
      severity: EActionSeverity.ACTION,
      action: (sample: ISampleEntity) => this.onPrint(sample),
      permission: { path: '/lims/gestion-muestras', action: ReceptionAction.IMPRIMIR_ETIQUETAS_GESTION }
    },
    {
      icon: ICONS.EYE,
      tooltip: 'Ver Detalle',
      action: (sample: ISampleEntity) => this.navigateToSampleDetail(sample.sampleId),
  severity: EActionSeverity.VIEW,
      permission: { path: '/lims/gestion-muestras', action: ReceptionAction.VER_DETALLE_MUESTRAS }
    }
  ];

  ngOnInit(): void {
    this.createForm();
    this.listenInitialDate();
    this.listenLastDate();
    this.listenSupplierIds();
    this.listenSampleTypeIds();
    this.initializePagination();
    this.listenSampleCode();
    this.listenStatusIds();
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  createForm() {
    const { startDate, endDate } = getActualMonthRange();
    this.form = this.fb.group({
      startDate: [startDate],
      endDate: [endDate],
      supplierIds: [null],
      sampleTypeIds: [null],
      sampleIds: [null],
      sampleCode: [null],
      statusIds: [null]
    });
  }

  initializePagination() {
    this.paginationService.setStartDate(formatDate(this.form.get('startDate')?.value));
    this.paginationService.setEndDate(formatDate(this.form.get('endDate')?.value));
  }

  listenInitialDate() {
    this.form
      .get('startDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setStartDate(formatDate(value));
        this.pageChange();
      });
  }

  listenLastDate() {
    this.form
      .get('endDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setEndDate(formatDate(value));
        this.pageChange();
      });
  }

  listenSupplierIds() {
    this.form
      .get('supplierIds')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setSupplierIds(value);
        this.pageChange();
      });
  }

  listenSampleTypeIds() {
    this.form
      .get('sampleTypeIds')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setSampleTypeIds(value);
        this.pageChange();
      });
  }

  listenSampleCode() {
    this.form
      .get('sampleCode')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe(value => {
        this.paginationService.setSampleCode(value);
        this.pageChange();
      });
  }

  listenStatusIds() {
    this.form
      .get('statusIds')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.paginationService.setStatusIds(value);
        this.pageChange();
      });
  }

  pageChange() {
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  onPrintVisibleChange(event: boolean) {
    this.printerModal.set(event);

    if (!event) {
      this.sampleToPrint.set({
        sampleId: ''
      });
      if (this.printComponent) {
        this.printComponent.resetForm();
      }
    }
  }

  onPrint(sample: ISampleEntity) {
    this.printerModal.set(true);
    this.sampleToPrint.set({
      sampleId: sample.sampleId
    });
  }

  onPrintSample(params: IPrintParams) {
    this.emitPrint.emit(params);
  }

  onPrintCancel() {
    this.printerModal.set(false);
    this.sampleToPrint.set({
      sampleId: ''
    });
  }

  getSampleStatusClass(sample: ISampleEntity): string {
    const statusClasses: Record<SampleStatus, string> = {
      [SampleStatus.RECEIVED]: 'bg-primary-100 text-primary-800 border-primary-200',
      [SampleStatus.IN_ANALYSIS]: 'bg-amber-50 text-amber-700 border-amber-200',
      [SampleStatus.SENT]: 'bg-primary-50 text-primary-700 border-primary-200',
      [SampleStatus.FINISHED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      [SampleStatus.CANCELLED]: 'bg-red-50 text-red-700 border-red-200'
    };

    return statusClasses[sample.status] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  }

  getStatusBadge(sample: ISampleEntity): string {
    const status = sample.status;
    const statusClass = this.getSampleStatusClass(sample);

    return `<span class="p-1 border-round-sm ${statusClass}">${status}</span>`;
  }

  navigateToSampleDetail(sampleId: string) {
    this.router.navigate(['/lims/gestion-muestras', sampleId]);
  }

  onViewChanged(view: string) {
    this.viewMode.set(view);
  }

  get getTotalRecords(): number {
    return this.paginationService.getTotalRecords();
  }
}
