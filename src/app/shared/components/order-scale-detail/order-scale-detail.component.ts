import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output, signal } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { TSeverityType } from "@/shared/types/severity-type.type";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { ProgressSpinner } from "primeng/progressspinner";

interface IDocumentView {
  title: string;
  url: string;
  safeUrl: SafeResourceUrl;
  type: "image" | "document";
}

@Component({
  selector: "svi-order-scale-detail",
  standalone: true,
  imports: [CommonModule, ButtonComponent, MenuModule, ProgressSpinner],
  templateUrl: "./order-scale-detail.component.html",
  styleUrl: "./order-scale-detail.component.scss"
})
export class OrderScaleDetailComponent {
  private readonly sanitizer = inject(DomSanitizer);

  order = input.required<IOrderEntity>();
  closeRequested = output<void>();

  readonly ICONS = ICONS;

  private readonly statusLabelMap: Record<EOrderScaleStatus, string> = {
    [EOrderScaleStatus.CREATED]: "Creada",
    [EOrderScaleStatus.PENDING]: "Pendiente",
    [EOrderScaleStatus.IN_PROCCESS]: "En proceso",
    [EOrderScaleStatus.COMPLETED]: "Completada",
    [EOrderScaleStatus.CANCELLED]: "Cancelada"
  };

  private readonly statusSeverityMap: Record<EOrderScaleStatus, Exclude<TSeverityType, "primary">> = {
    [EOrderScaleStatus.CREATED]: "info",
    [EOrderScaleStatus.PENDING]: "warn",
    [EOrderScaleStatus.IN_PROCCESS]: "info",
    [EOrderScaleStatus.COMPLETED]: "success",
    [EOrderScaleStatus.CANCELLED]: "danger",
  };

  readonly materialType = computed(() => this.order().materialType?.name ?? "Sin tipo");
  readonly driverName = computed(() => this.order().driver?.name ?? "Sin conductor");
  readonly driverDocumentNumber = computed(() => this.order().driver?.documentNumber ?? "Sin documento");
  readonly driverDocumentType = computed(() => this.order().driver?.documentType?.name ?? "");
  readonly supplierName = computed(() => this.order().supplier?.name ?? "Sin proveedor");
  readonly vehiclePlate = computed(() => this.order().vehicle?.plate ?? "Sin vehículo");
  readonly vehicleType = computed(() => this.order().vehicle?.vehicleType?.name ?? "Sin tipo");
  readonly batchName = computed(() => this.order().batch?.name ?? "Sin lote");
  readonly mineName = computed(() => this.order().mine?.name ?? "Sin mina");
  readonly destinationZone = computed(() => this.order().destinationStorageZone?.name ?? "Sin zona destino");
  readonly originZone = computed(() => this.order().originStorageZone?.name ?? null);
  readonly statusText = computed(() => this.statusLabelMap[this.order().status] ?? "Sin estado");
  readonly statusSeverity = computed(() => this.statusSeverityMap[this.order().status] ?? "info");

  readonly hasVeedor = computed(() => !!this.order().veedor);
  readonly veedorName = computed(() => this.order().veedor?.name ?? "Sin veedor");
  readonly veedorDocumentNumber = computed(() => this.order().veedor?.documentNumber ?? "Sin documento");
  readonly veedorDocumentType = computed(() => this.order().veedor?.documentType?.name ?? "");

  readonly driverCcUrl = computed(() => this.order().driver?.documents?.ccUrl ?? null);
  readonly driverArlUrl = computed(() => this.order().driver?.documents?.arlUrl ?? null);
  readonly vehicleRegistrationUrl = computed(() => this.order().vehicle?.documents?.registrationUrl ?? null);
  readonly vehicleSoatUrl = computed(() => this.order().vehicle?.documents?.soatUrl ?? null);
  readonly vehicleTechnomechanicalUrl = computed(() => this.order().vehicle?.documents?.technomechanicalUrl ?? null);
  readonly veedorCcUrl = computed(() => this.order().veedor?.documents?.ccUrl ?? null);
  readonly veedorArlUrl = computed(() => this.order().veedor?.documents?.arlUrl ?? null);

  readonly hasDriverDocuments = computed(() => Boolean(this.driverCcUrl() || this.driverArlUrl()));
  readonly hasVehicleDocuments = computed(() => Boolean(this.vehicleRegistrationUrl() || this.vehicleSoatUrl() || this.vehicleTechnomechanicalUrl()));
  readonly hasVeedorDocuments = computed(() => Boolean(this.veedorCcUrl() || this.veedorArlUrl()));

  readonly driverDocumentMenuItems = computed<MenuItem[]>(() => [
    {
      label: "Documento",
      icon: ICONS.DRIVER,
      disabled: !this.driverCcUrl(),
      command: () => this.openDocument("Cédula del conductor", this.driverCcUrl()!)
    },
    {
      label: "ARL",
      icon: ICONS.SHIELD,
      disabled: !this.driverArlUrl(),
      command: () => this.openDocument("ARL del conductor", this.driverArlUrl()!)
    }
  ]);

  readonly vehicleDocumentMenuItems = computed<MenuItem[]>(() => [
    {
      label: "Matrícula",
      icon: ICONS.DOCUMENT,
      disabled: !this.vehicleRegistrationUrl(),
      command: () => this.openDocument("Matrícula del vehículo", this.vehicleRegistrationUrl()!)
    },
    {
      label: "SOAT",
      icon: ICONS.DOCUMENT,
      disabled: !this.vehicleSoatUrl(),
      command: () => this.openDocument("SOAT del vehículo", this.vehicleSoatUrl()!)
    },
    {
      label: "Tecnomecánica",
      icon: ICONS.DOCUMENT,
      disabled: !this.vehicleTechnomechanicalUrl(),
      command: () => this.openDocument("Tecnomecánica del vehículo", this.vehicleTechnomechanicalUrl()!)
    }
  ]);

  readonly veedorDocumentMenuItems = computed<MenuItem[]>(() => [
    {
      label: "Documento",
      icon: ICONS.DRIVER,
      disabled: !this.veedorCcUrl(),
      command: () => this.openDocument("Cédula del veedor", this.veedorCcUrl()!)
    },
    {
      label: "ARL",
      icon: ICONS.SHIELD,
      disabled: !this.veedorArlUrl(),
      command: () => this.openDocument("ARL del veedor", this.veedorArlUrl()!)
    }
  ]);

  readonly firstWeightImageUrl = computed(() => this.order().urlFirstWeightImage ?? null);
  readonly secondWeightImageUrl = computed(() => this.order().urlSecondWeightImage ?? null);

  selectedDocument = signal<IDocumentView | null>(null);
  imageLoading = signal(false);

  openDocument(title: string, url: string, type: "image" | "document" = "document"): void {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    if (type === "image") {
      this.imageLoading.set(true);
    }
    this.selectedDocument.set({ title, url, safeUrl, type });
  }

  onImageLoad(): void {
    this.imageLoading.set(false);
  }

  closeDocumentView(): void {
    this.selectedDocument.set(null);
  }

  handleClose(): void {
    this.closeRequested.emit();
  }

  get orderValue(): IOrderEntity {
    return this.order();
  }

  formatWeight(value: string | number | null): string {
    if (value === null || value === undefined) {
      return "Pendiente";
    }

    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) {
      return typeof value === "string" ? value : String(value);
    }

    const formatted = new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numeric);

    return `${formatted} ${EWeightUnits.KILOGRAMS}`;
  }

  formatDate(value: string | null): string {
    if (!value) {
      return "Pendiente";
    }

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }
}
