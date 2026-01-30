import { Component, computed, DestroyRef, inject, input, OnInit, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { TableAction, TableColumn, TableComponent } from "@/shared/components/table/table.component";
import { PaginatorComponent } from "@/shared/components/paginator/paginator.component";

import { ISupplierOrderEntity } from "@/domain/entities/suppliers/admin/weighing-orders/supplier-order.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { EActionSeverity } from "@/shared/enums/action-severity.enum";
import { EMineralSendActions } from "@/presentation/modules/suppliers/actions.enum";
import { PaginationMetadata } from "@SV-Development/utilities";
import { MINERAL_SEND_LOADING } from "../../mineral-send.loading";
import { PaginationService } from "@/shared/services/pagination.service";

interface StatusOption {
  label: string;
  value: string;
}

@Component({
  selector: "svi-orders-list",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    EmptyStateComponent,
    LoadingComponent,
    FloatInputComponent,
    FloatSelectComponent,
    TableComponent,
    PaginatorComponent
  ],
  templateUrl: "./orders-list.component.html",
  styleUrl: "./orders-list.component.scss"
})
export class OrdersListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly paginationService = inject(PaginationService);

  orders = input<ISupplierOrderEntity[]>([]);
  meta = input<PaginationMetadata | null>(null);
  loading = input<boolean>(false);
  initialSearch = input<string>('');
  initialStatus = input<string | null>(null);

  createOrder = output<void>();
  viewOrder = output<ISupplierOrderEntity>();
  editOrder = output<ISupplierOrderEntity>();
  cancelOrder = output<ISupplierOrderEntity>();
  pageChange = output<void>();
  searchChange = output<string>();
  statusChange = output<string | null>();

  private readonly path = '/proveedores/envio-de-mineral-cnc';

  readonly ICONS = ICONS;
  readonly LOADING = MINERAL_SEND_LOADING;

  searchControl = new FormControl<string>("", { nonNullable: true });
  statusControl = new FormControl<string | null>(null);

  readonly statusOptions: StatusOption[] = [
    { label: "Todos", value: "" },
    { label: "Creado", value: "CREADO" },
    { label: "Pendiente", value: "PENDIENTE" },
    { label: "En proceso", value: "PROCESO" },
    { label: "Completado", value: "COMPLETADO" },
    { label: "Cancelado", value: "CANCELADO" }
  ];

  hasOrders = computed(() => this.orders().length > 0);

  columns: TableColumn[] = [
    { field: "consecutive", header: "Consecutivo", width: "10%" },
    { 
      field: "vehicle", 
      header: "Vehículo", 
      width: "12%",
      template: (order: ISupplierOrderEntity) => order.vehicle.plate
    },
    { 
      field: "driver", 
      header: "Conductor", 
      width: "15%",
      template: (order: ISupplierOrderEntity) => order.driver.name
    },
    { 
      field: "materialType", 
      header: "Material", 
      width: "12%",
      template: (order: ISupplierOrderEntity) => order.materialType.name
    },
    { 
      field: "mine", 
      header: "Mina", 
      width: "10%",
      template: (order: ISupplierOrderEntity) => order.mine?.name ?? "-"
    },
    { 
      field: "supplierBatchName", 
      header: "Lote", 
      width: "10%",
      template: (order: ISupplierOrderEntity) => order.supplierBatchName ?? "-"
    },
    { 
      field: "sendedWeight", 
      header: "Peso Enviado", 
      width: "8%",
      template: (order: ISupplierOrderEntity) => order.sendedWeight ? `${order.sendedWeight} kg` : "-"
    },
    { 
      field: "estimatedShippingDateTime", 
      header: "Fecha Estimada", 
      width: "14%",
      type: "date"
    },
    { 
      field: "status", 
      header: "Estado", 
      width: "10%",
      type: "badge",
      badgeText: (order: string) => this.getStatusLabel(order),
      badgeSeverity: (order: string) => this.getStatusSeverity(order)
    }
  ];

  actions: TableAction[] = [
    {
      icon: ICONS.EYE,
      tooltip: "Ver detalle",
      severity: EActionSeverity.VIEW,
      action: (order: ISupplierOrderEntity) => this.viewOrder.emit(order),
      permission: { path: this.path, action: EMineralSendActions.VER_ORDEN_ENVIO_BASCULA }
    },
    {
      icon: ICONS.PENCIL,
      tooltip: "Editar",
      severity: EActionSeverity.EDIT,
      action: (order: ISupplierOrderEntity) => this.editOrder.emit(order),
      disabled: (order: ISupplierOrderEntity) => !this.canEdit(order),
      permission: { path: this.path, action: EMineralSendActions.EDITAR_ORDEN_ENVIO_BASCULA }
    },
    {
      icon: ICONS.CANCEL,
      tooltip: "Cancelar",
      severity: EActionSeverity.DELETE,
      action: (order: ISupplierOrderEntity) => this.cancelOrder.emit(order),
      disabled: (order: ISupplierOrderEntity) => !this.canCancel(order),
      permission: { path: this.path, action: EMineralSendActions.CANCELAR_ORDEN_ENVIO_BASCULA }
    }
  ];

  ngOnInit(): void {
    // Sincronizar con valores iniciales
    const search = this.initialSearch();
    const status = this.initialStatus();
    
    if (search) {
      this.searchControl.setValue(search, { emitEvent: false });
    }
    if (status) {
      this.statusControl.setValue(status, { emitEvent: false });
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.paginationService.setSearch(value);
      this.searchChange.emit(value);
      this.pageChange.emit();
    });

    this.statusControl.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.statusChange.emit(value || null);
      this.pageChange.emit();
    });
  }

  onPageChange(): void {
    this.pageChange.emit();
  }

  get totalRecords(): number {
    return this.meta()?.total ?? 0;
  }

  canEdit(order: ISupplierOrderEntity): boolean {
    return order.status === "CREADO";
  }

  canCancel(order: ISupplierOrderEntity): boolean {
    return order.status === "CREADO";
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" {
    const severityMap: Record<string, "success" | "secondary" | "info" | "warn" | "danger"> = {
      CREADO: "info",
      PENDIENTE: "secondary",
      PROCESO: "warn",
      COMPLETADO: "success",
      CANCELADO: "danger"
    };
    return severityMap[status] ?? "secondary";
  }

  getStatusLabel(status: string): string {
    console.log(status)
    const labelMap: Record<string, string> = {
      CREADO: "Creado",
      PENDIENTE: "Pendiente",
      PROCESO: "En proceso",
      COMPLETADO: "Completado",
      CANCELADO: "Cancelado"
    };
    return labelMap[status] ?? status;
  }
}
