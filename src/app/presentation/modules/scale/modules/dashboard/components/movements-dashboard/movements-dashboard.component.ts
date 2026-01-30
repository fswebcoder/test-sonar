import { Component, computed, input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputSwitchModule } from "primeng/inputswitch";

import { StatCardComponent } from "@/shared/components/stat-card/stat-card.component";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { BarChartComponent, DoughnutChartComponent } from "@/shared/components/charts";

import { IMovementsDashboardEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { DASHBOARD_LOADING } from "../../dashboard.loading";

@Component({
  selector: "svi-movements-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule,
    StatCardComponent,
    EmptyStateComponent,
    LoadingComponent,
    BarChartComponent,
    DoughnutChartComponent
  ],
  templateUrl: "./movements-dashboard.component.html",
  styleUrl: "./movements-dashboard.component.scss"
})
export class MovementsDashboardComponent {
  dashboard = input<IMovementsDashboardEntity | null>(null);
  hasSupplierFilter = input<boolean>(false);
  hasMineFilter = input<boolean>(false);

  readonly ICONS = ICONS;
  readonly LOADING = DASHBOARD_LOADING;

  useToneladas = signal<boolean>(false);

  hasData = computed(() => !!this.dashboard());

  statusChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.byStatus.map(s => this.formatStatus(s.status)),
      datasets: [
        {
          data: data.byStatus.map(s => s.count),
          backgroundColor: data.byStatus.map(s => this.getStatusColor(s.status))
        }
      ]
    };
  });

  locationFlowsChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const flows = data.locationFlows.slice(0, 10);
    return {
      labels: flows.map(f => `${f.originZoneName} → ${f.destinationZoneName}`),
      datasets: [
        {
          label: "Movimientos",
          data: flows.map(f => f.totalMovements),
          backgroundColor: "#8B5CF6"
        }
      ]
    };
  });

  supplierChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const divisor = isTon ? 1000 : 1;

    const suppliers = data.bySupplier.slice(0, 8);
    return {
      labels: suppliers.map(s => s.supplierName),
      datasets: [
        {
          label: isTon ? "Peso (ton)" : "Peso (kg)",
          data: suppliers.map(s => isTon ? Math.round(s.totalNetWeight / divisor) : s.totalNetWeight),
          backgroundColor: "#3B82F6"
        }
      ]
    };
  });

  mineChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const divisor = isTon ? 1000 : 1;

    const mines = data.byMine.slice(0, 8);
    return {
      labels: mines.map(m => m.mineName),
      datasets: [
        {
          label: isTon ? "Peso (ton)" : "Peso (kg)",
          data: mines.map(m => isTon ? Math.round(m.totalNetWeight / divisor) : m.totalNetWeight),
          backgroundColor: "#10B981"
        }
      ]
    };
  });

  formatWeight(value: number): string {
    if (this.useToneladas()) {
      const tons = value / 1000;
      return `${tons.toLocaleString("es-CO", { maximumFractionDigits: 2 })} ton`;
    }
    return `${value.toLocaleString("es-CO", { maximumFractionDigits: 2 })} ${EWeightUnits.KILOGRAMS}`;
  }

  formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      [EOrderScaleStatus.COMPLETED]: "Completado",
      [EOrderScaleStatus.PENDING]: "Pendiente",
      [EOrderScaleStatus.CREATED]: "Creado",
      [EOrderScaleStatus.IN_PROCCESS]: "En Proceso",
      [EOrderScaleStatus.CANCELLED]: "Cancelado"
    };
    return statusMap[status] || status;
  }

  private getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      [EOrderScaleStatus.COMPLETED]: "#22C55E",
      [EOrderScaleStatus.PENDING]: "#F59E0B",
      [EOrderScaleStatus.CREATED]: "#3B82F6",
      [EOrderScaleStatus.IN_PROCCESS]: "#8B5CF6",
      [EOrderScaleStatus.CANCELLED]: "#EF4444"
    };
    return colorMap[status] || "#6B7280";
  }
}
