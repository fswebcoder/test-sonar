import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { ScaleCardComponent } from "@/shared/components/scale-card/scale-card.component";
import { TooltipModule } from "primeng/tooltip";
import { TSeverityType } from "@/shared/types/severity-type.type";
import { ScaleActions } from "@/presentation/modules/scale/modules/actions.enum";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { CardButtonComponent } from "@/shared/components/card-button/card-button.component";
import { EActionSeverity } from "@/shared/enums/action-severity.enum";
import { OrderScaleCardItemComponent } from "../order-scale-card-item/order-scale-card-item.component";

@Component({
  selector: "svi-order-scale-card",
  standalone: true,
  imports: [CommonModule, ScaleCardComponent, TooltipModule, CardButtonComponent, OrderScaleCardItemComponent],
  templateUrl: "./order-scale-card.component.html",
  styleUrl: "./order-scale-card.component.scss"
})
export class OrderScaleCardComponent {
  order = input.required<IOrderEntity>();
  permissionPath = input.required<string>();
  viewAction = input<ScaleActions>(ScaleActions.VER_ORDENES_DE_PESAJE);
  weightAction = input<ScaleActions | null>(null);
  assignBatchAction = input<ScaleActions | null>(null);
  requiresWeightCapture = input<boolean>(false);
  titlePrefix = input<string>("Orden de pesaje");

  addWeight = output<IOrderEntity>();
  assignBatch = output<IOrderEntity>();
  viewDetails = output<IOrderEntity>();

  readonly ICONS = ICONS;
  readonly EActionSeverity = EActionSeverity;

  private readonly statusLabelMap: Record<EOrderScaleStatus, string> = {
    [EOrderScaleStatus.CREATED]: "Creada",
    [EOrderScaleStatus.PENDING]: "Pendiente",
    [EOrderScaleStatus.IN_PROCCESS]: "En proceso",
    [EOrderScaleStatus.COMPLETED]: "Completada",
    [EOrderScaleStatus.CANCELLED]: "Cancelada"
  };

  private readonly statusSeverityMap: Record<EOrderScaleStatus, TSeverityType> = {
    [EOrderScaleStatus.CREATED]: "info",
    [EOrderScaleStatus.PENDING]: "warn",
    [EOrderScaleStatus.IN_PROCCESS]: "info",
    [EOrderScaleStatus.COMPLETED]: "success",
    [EOrderScaleStatus.CANCELLED]: "danger"
  };

  readonly title = computed(() => `${this.titlePrefix()} ${this.order().consecutive}`);
  readonly subtitle = computed(() => this.order().materialType?.name ?? "Sin tipo de material");
  readonly statusText = computed(() => this.statusLabelMap[this.order().status] ?? "Sin estado");
  readonly statusSeverity = computed(() => this.statusSeverityMap[this.order().status] ?? "info");

  readonly statusPillClass = computed(() => {
    const severity = this.statusSeverity();
    return {
      'order-card__status--info': severity === 'info',
      'order-card__status--warn': severity === 'warn',
      'order-card__status--success': severity === 'success',
      'order-card__status--danger': severity === 'danger',
    };
  });

  readonly vehiclePlate = computed(() => this.order().vehicle?.plate ?? "Sin vehículo");
  readonly supplierName = computed(() => this.order().supplier?.name ?? "Sin proveedor");
  readonly mineName = computed(() => this.order().mine?.name ?? "Sin mina");
  readonly batch = computed(() => this.order().batch?.name ?? "Sin lote");

  readonly showWeightButton = computed(
    () => this.requiresWeightCapture() && this.weightAction() !== null
  );

  readonly showAssignBatchButton = computed(
    () => this.assignBatchAction() !== null && this.order().status === EOrderScaleStatus.CREATED
  );

  handleAddWeight(): void {
    this.addWeight.emit(this.order());
  }

  handleAssignBatch(): void {
    this.assignBatch.emit(this.order());
  }

  handleViewDetails(): void {
    this.viewDetails.emit(this.order());
  }
}
