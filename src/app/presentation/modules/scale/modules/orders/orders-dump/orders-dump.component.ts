import { Component, DestroyRef, OnInit, ViewChild, computed, effect, inject, input, output, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { TableComponent, TableColumn, TableAction } from "@/shared/components/table/table.component";
import { PaginatorComponent } from "@/shared/components/paginator/paginator.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { DialogComponent } from "@/shared/components/dialog/dialog.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { FloatMultiselectComponent } from "@/shared/components/form/multiselect/multiselect.component";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { ViewSwitcherComponent } from "@/shared/components/view-switcher/view-switcher.component";
import { PermissionDirective } from "@/core/directives";

import { PaginationService } from "@/shared/services/pagination.service";
import { ICONS } from "@/shared/enums/general.enum";
import { ScaleActions } from "@scale/modules/actions.enum";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { OrderFormComponent } from "@/presentation/modules/scale/modules/orders/components/order-form/order-form.component";
import { AssignBatchOrderFormComponent } from "@/presentation/modules/scale/modules/orders/components/assign-batch-order-form/assign-batch-order-form.component";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IVehicleCatalogEntity } from "@/domain/entities/common/vehicle-catalog.entity";
import { IDriverCatalogEntity } from "@/domain/entities/common/driver-catalog.entity";
import { OrderScaleDetailComponent } from "@/shared/components/order-scale-detail/order-scale-detail.component";
import { OrderScaleCardComponent } from "@/shared/components/order-scale-card/order-scale-card.component";
import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";
import { IMaterialTypeCatalogEntity } from "@/domain/entities/common/material-type-catalog.entity";
import { TabsComponent } from "@/shared/components/tabs/tabs.component";
import { EActionSeverity } from "@/shared/enums/action-severity.enum";
import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { ToastCustomService } from "@SV-Development/utilities";

@Component({
  selector: "svi-orders-dump",
  imports: [
    TableComponent,
    PaginatorComponent,
    ButtonComponent,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    FloatInputComponent,
    FloatMultiselectComponent,
    EmptyStateComponent,
    ViewSwitcherComponent,
    OrderFormComponent,
    AssignBatchOrderFormComponent,
    OrderScaleCardComponent,
    OrderScaleDetailComponent,
    PermissionDirective,
    TabsComponent
  ],
  templateUrl: "./orders-dump.component.html",
  styleUrl: "./orders-dump.component.scss"
})
export class OrdersDumpComponent implements OnInit {
  orders = input.required<IOrderEntity[]>();
  drivers = input.required<IDriverCatalogEntity[]>();
  vehicles = input.required<IVehicleCatalogEntity[]>();
  materialTypes = input.required<IMaterialTypeCatalogEntity[]>();
  storageZones = input.required<IIdName[]>();
  mines = input.required<IIdName[]>();
  batches = input.required<IIdName[]>();
  suppliers = input.required<IsupplierListResponseEntity[]>();

  title = input<string>("Órdenes de pesaje");
  createButtonLabel = input<string>("Nueva orden de pesaje");
  permissionsPath = input<string>("bascula/ordenes-de-pesaje");
  showCreateButton = input<boolean>(true);
  emptyStateTitle = input<string>("No se encontraron órdenes de pesaje.");
  emptyStateDescription = input<string>("Intenta ajustar los filtros o crear un nuevo registro.");
  dialogHeader = input<string>("Registrar orden de pesaje");
  orderType = input<EOrderScaleType>(EOrderScaleType.RECEPTION);

  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastCustomService = inject(ToastCustomService);

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;

  orderModal = signal<boolean>(false);
  viewMode = signal<"table" | "cards">("cards");
  detailModal = signal<boolean>(false);
  detailDialogHeader = signal<string>("");

  selectedOrder = signal<IOrderEntity | null>(null);
  activeOrderType = signal<EOrderScaleType>(this.orderType());

  assignBatchModal = signal<boolean>(false);
  assignBatchDialogHeader = computed(() => {
    const order = this.selectedOrder();
    return order ? `Asignar lote - Orden ${order.consecutive}` : "Asignar lote";
  });

  filterForm: FormGroup = this.formBuilder.group({
    search: [""],
    orderType: [EOrderScaleType.RECEPTION],
    statuses: [[EOrderScaleStatus.PENDING, EOrderScaleStatus.CREATED]]
  });

  createOrderSubmit = output<ICreateOrderParamsEntity>();
  supplierIdChange = output<string>();
  mineIdChange = output<string>();
  orderTypeChange = output<EOrderScaleType>();
  assignBatchSubmit = output<IAsignBatchOrderParams>();

  readonly orderTypeOptions: Array<{ label: string; value: EOrderScaleType }> = [
    { label: "Recepción", value: EOrderScaleType.RECEPTION },
    { label: "Movimiento", value: EOrderScaleType.MOVEMENT }
  ];

  readonly statusOptions: Array<{ label: string; value: EOrderScaleStatus }> = [
    { label: "Pendiente", value: EOrderScaleStatus.PENDING },
    { label: "Creada", value: EOrderScaleStatus.CREATED },
    { label: "En proceso", value: EOrderScaleStatus.IN_PROCCESS },
    { label: "Completadas", value: EOrderScaleStatus.COMPLETED },
    { label: "Canceladas", value: EOrderScaleStatus.CANCELLED }
  ];

  readonly defaultStatuses: EOrderScaleStatus[] = [EOrderScaleStatus.PENDING, EOrderScaleStatus.CREATED];

  @ViewChild(OrderFormComponent) orderFormComponent?: OrderFormComponent;

  readonly tableActions: TableAction[] = [
    {
      icon: ICONS.EYE,
      tooltip: "Ver detalle",
      severity: EActionSeverity.VIEW,
      action: (order: IOrderEntity) => this.handleViewDetails(order),
      permission: {
        action: ScaleActions.VER_ORDENES_DE_PESAJE,
        path: this.permissionsPath()
      }
    },
    {
      icon: ICONS.ADD,
      tooltip: "Asignar lote",
      severity: EActionSeverity.EDIT,
      action: (order: IOrderEntity) => this.openAssignBatchModal(order),
      disabled: (order: IOrderEntity) => !this.canAssignBatch(order),
      permission: {
        action: ScaleActions.ASIGNAR_LOTE_A_REGISTRO_DE_PESO,
        path: this.permissionsPath()
      }
    }
  ];

  orderList = computed(() => this.orders());
  viewOptions = computed(() => [
    { value: "table", label: "Tabla", icon: "pi pi-bars" },
    { value: "cards", label: "Tarjetas", icon: "pi pi-table" }
  ]);

  columns: TableColumn[] = [
    { field: "consecutive", header: "Consecutivo", type: "text" },
    {
      field: "driver",
      header: "Conductor",
      template: (item: IOrderEntity) => item.driver?.name ?? ""
    },
    {
      field: "vehicle",
      header: "Vehículo",
      template: (item: IOrderEntity) => item.vehicle?.plate ?? ""
    },
    {
      field: "supplier",
      header: "Proveedor",
      template: (item: IOrderEntity) => item.supplier?.name ?? ""
    },
    {
      field: "batch",
      header: "Lote",
      template: (item: IOrderEntity) => item.batch?.name ?? ""
    },
    {
      field: "materialType",
      header: "Tipo de material",
      template: (item: IOrderEntity) => item.materialType?.name ?? ""
    },
    {
      field: "mine",
      header: "Mina",
      template: (item: IOrderEntity) => item.mine?.name ?? "Sin mina"
    },
    {
      field: "netWeight",
      header: "Peso neto",
      template: (item: IOrderEntity) => item.netWeight ?? "Pendiente"
    },
    {
      field: "dateFirstWeight",
      header: "Primer pesaje",
      template: (item: IOrderEntity) => this.formatDate(item.dateFirstWeight)
    },
    {
      field: "dateSecondWeight",
      header: "Segundo pesaje",
      template: (item: IOrderEntity) => this.formatDate(item.dateSecondWeight)
    }
  ];

  private readonly syncOrderType = effect(() => {
    const type = this.orderType();
    this.filterForm.get("orderType")?.setValue(type, { emitEvent: false });
    this.activeOrderType.set(type);
  });

  ngOnInit(): void {
    this.initializeFilters();
    this.listenToFormChanges();
  }

  openOrderModal(): void {
    this.orderModal.set(true);
    this.orderFormComponent?.resetForm();
    this.supplierIdChange.emit("");
  }

  closeOrderModal(): void {
    this.orderModal.set(false);
    this.orderFormComponent?.resetForm();
    this.supplierIdChange.emit("");
  }

  submitCreateOrder(event: ICreateOrderParamsEntity): void {
    this.createOrderSubmit.emit(event);
  }

  supplierChanged(supplierId: string): void {
    this.supplierIdChange.emit(supplierId);
  }

  mineChanged(mineId: string): void {
    this.mineIdChange.emit(mineId);
  }

  handleViewDetails(order: IOrderEntity): void {
    this.selectedOrder.set(order);
    this.detailDialogHeader.set(`Detalle de la orden ${order.consecutive}`);
    this.detailModal.set(true);
  }

  closeDetailModal(): void {
    this.detailModal.set(false);
    this.selectedOrder.set(null);
    this.detailDialogHeader.set("");
  }

  openAssignBatchModal(order: IOrderEntity): void {
    if (!this.canAssignBatch(order)) {
      this.toastCustomService.info("Solo se puede asignar lote a las órdenes en estado Creada.");
      return;
    }

    this.selectedOrder.set(order);
    this.assignBatchModal.set(true);

    if (order.mine?.id) {
      this.mineIdChange.emit(order.mine.id);
    }
  }

  private canAssignBatch(order: IOrderEntity | null | undefined): boolean {
    return !!order && order.status === EOrderScaleStatus.CREATED;
  }

  closeAssignBatchModal(): void {
    this.assignBatchModal.set(false);
    this.selectedOrder.set(null);
  }

  handleAssignBatchSubmit(payload: IAsignBatchOrderParams): void {
    this.assignBatchSubmit.emit(payload);
  }

  onViewModeChange(mode: string): void {
    if (mode === "table" || mode === "cards") {
      this.viewMode.set(mode);
    }
  }

  get totalRecords(): number {
    return this.paginationService.getTotalRecords();
  }

  private initializeFilters(): void {
    const params = this.paginationService.getPaginationParams();
    const search = params.search ?? "";
    this.filterForm.get("search")?.setValue(search, { emitEvent: false });
    this.paginationService.setSearch(search);

    const paramsStatuses = (params.statusIds ?? []) as EOrderScaleStatus[];
    const statuses = paramsStatuses.length > 0 ? paramsStatuses : this.defaultStatuses;
    this.filterForm.get("statuses")?.setValue(statuses, { emitEvent: false });
    this.paginationService.setStatusIds(statuses);
  }

  private listenToFormChanges(): void {
    const searchControl = this.filterForm.get("search");
    const orderTypeControl = this.filterForm.get("orderType");
    const statusesControl = this.filterForm.get("statuses");

    searchControl?.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        const sanitizedValue = (value ?? "").toString();
        this.paginationService.setSearch(sanitizedValue);
        this.resetToFirstPage();
      });

    orderTypeControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(operationType => {
        if (!operationType) {
          return;
        }

        const type = operationType as EOrderScaleType;
        this.activeOrderType.set(type);
        this.orderTypeChange.emit(type);
        this.resetToFirstPage();
      });

    statusesControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((statuses: EOrderScaleStatus[]) => {
        const selectedStatuses = statuses?.length > 0 ? statuses : this.defaultStatuses;
        this.paginationService.setStatusIds(selectedStatuses);
        this.resetToFirstPage();
      });
  }

  private resetToFirstPage(): void {
    const paginationState = this.paginationService.paginationState();
    this.paginationService.updatePagination({
      first: 0,
      rows: paginationState.rows
    });
  }

  private formatDate(value: string | null): string {
    if (!value) {
      return "Pendiente";
    }

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  onOrderTypeTabChange(value: EOrderScaleType | string | number | null): void {
    if (!value) return;
    this.filterForm.get("orderType")?.setValue(value as EOrderScaleType);
  }
}
