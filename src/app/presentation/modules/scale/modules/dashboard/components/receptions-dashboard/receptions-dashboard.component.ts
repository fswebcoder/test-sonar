import { Component, computed, input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputSwitchModule } from "primeng/inputswitch";

import { StatCardComponent } from "@/shared/components/stat-card/stat-card.component";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import {
  LineChartComponent,
  BarChartComponent,
  DoughnutChartComponent,
  GroupedBarChartComponent
} from "@/shared/components/charts";

import { IWeighbridgeDashboardEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { DASHBOARD_LOADING } from "../../dashboard.loading";

@Component({
  selector: "svi-receptions-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule,
    StatCardComponent,
    EmptyStateComponent,
    LoadingComponent,
    LineChartComponent,
    BarChartComponent,
    DoughnutChartComponent,
    GroupedBarChartComponent
  ],
  templateUrl: "./receptions-dashboard.component.html",
  styleUrl: "./receptions-dashboard.component.scss"
})
export class ReceptionsDashboardComponent {
  dashboard = input<IWeighbridgeDashboardEntity | null>(null);
  hasSupplierFilter = input<boolean>(false);
  hasMineFilter = input<boolean>(false);

  readonly ICONS = ICONS;
  readonly LOADING = DASHBOARD_LOADING;

  useToneladas = signal<boolean>(false);

  hasData = computed(() => !!this.dashboard());

  dailyTrendsChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.dailyTrends.map(d => this.formatDate(d.date)),
      datasets: [
        {
          label: "Recepciones",
          data: data.dailyTrends.map(d => d.receptions),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4
        }
      ]
    };
  });

  statusDistributionChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const statusColors: Record<string, string> = {
      [EOrderScaleStatus.COMPLETED]: "#10B981",
      [EOrderScaleStatus.PENDING]: "#F59E0B",
      [EOrderScaleStatus.CREATED]: "#60A5FA",
      [EOrderScaleStatus.IN_PROCCESS]: "#3B82F6",
      [EOrderScaleStatus.CANCELLED]: "#EF4444"
    };

    return {
      labels: data.byStatus.map(s => this.formatStatus(s.status)),
      datasets: [
        {
          data: data.byStatus.map(s => s.count),
          backgroundColor: data.byStatus.map(s => statusColors[s.status] || "#6B7280")
        }
      ]
    };
  });

  materialTypesChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const unit = isTon ? "ton" : "kg";
    const divisor = isTon ? 1000 : 1;

    return {
      labels: data.byMaterialType.map(m => m.materialTypeName),
      datasets: [
        {
          label: `Peso Neto (${unit})`,
          data: data.byMaterialType.map(m => isTon ? Math.round(m.totalNetWeight / divisor) : m.totalNetWeight),
          backgroundColor: "#3B82F6"
        }
      ]
    };
  });

  supplierChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.bySupplier.slice(0, 10).map(s => s.supplierName),
      datasets: [
        {
          label: "Viajes",
          data: data.bySupplier.slice(0, 10).map(s => s.totalTrips),
          backgroundColor: "#10B981"
        }
      ]
    };
  });

  hourlyDistributionChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const hourMap = new Map(data.hourlyDistribution.map(h => [h.hour, h.count]));

    return {
      labels: hours.map(h => h.toString().padStart(2, "0")),
      datasets: [
        {
          label: "Registros",
          data: hours.map(h => hourMap.get(h) ?? 0),
          backgroundColor: "#8B5CF6"
        }
      ]
    };
  });

  mineChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const unit = isTon ? "ton" : "kg";
    const divisor = isTon ? 1000 : 1;

    const mines = data.byMine.slice(0, 8);
    return {
      labels: mines.map(m => m.mineName),
      datasets: [
        {
          label: "Viajes",
          data: mines.map(m => m.totalTrips),
          backgroundColor: "#3B82F6",
          yAxisID: "y"
        },
        {
          label: `Peso (${unit})`,
          data: mines.map(m => isTon ? Math.round(m.totalNetWeight / divisor) : m.totalNetWeight),
          backgroundColor: "#10B981",
          yAxisID: "y1"
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
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
}
