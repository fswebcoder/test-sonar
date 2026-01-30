import { Component, computed, input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputSwitchModule } from "primeng/inputswitch";

import { StatCardComponent } from "@/shared/components/stat-card/stat-card.component";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { BarChartComponent, DoughnutChartComponent } from "@/shared/components/charts";

import { IStockByLocationEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { DASHBOARD_LOADING } from "../../dashboard.loading";

@Component({
  selector: "svi-stock-dashboard",
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
  templateUrl: "./stock-dashboard.component.html",
  styleUrl: "./stock-dashboard.component.scss"
})
export class StockDashboardComponent {
  dashboard = input<IStockByLocationEntity | null>(null);
  hasSupplierFilter = input<boolean>(false);

  readonly ICONS = ICONS;
  readonly LOADING = DASHBOARD_LOADING;

  useToneladas = signal<boolean>(false);

  hasData = computed(() => {
    const data = this.dashboard();
    return !!data && data.zones.length > 0;
  });

  stockByZoneChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const divisor = isTon ? 1000 : 1;

    return {
      labels: data.zones.map(z => z.zoneName),
      datasets: [
        {
          label: isTon ? "Stock Final (ton)" : "Stock Final (kg)",
          data: data.zones.map(z => isTon ? Math.round(z.finalStock / divisor) : z.finalStock),
          backgroundColor: "#3B82F6"
        }
      ]
    };
  });

  flowByZoneChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const divisor = isTon ? 1000 : 1;

    return {
      labels: data.zones.map(z => z.zoneName),
      datasets: [
        {
          label: isTon ? "Entradas (ton)" : "Entradas (kg)",
          data: data.zones.map(z => isTon ? Math.round(z.movements.inputs / divisor) : z.movements.inputs),
          backgroundColor: "#10B981"
        },
        {
          label: isTon ? "Salidas (ton)" : "Salidas (kg)",
          data: data.zones.map(z => isTon ? Math.round(z.movements.outputs / divisor) : z.movements.outputs),
          backgroundColor: "#EF4444"
        }
      ]
    };
  });

  stockDistributionChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#6366F1", "#EC4899", "#14B8A6"];

    return {
      labels: data.zones.map(z => z.zoneName),
      datasets: [
        {
          data: data.zones.map(z => z.finalStock),
          backgroundColor: data.zones.map((_, i) => colors[i % colors.length])
        }
      ]
    };
  });

  topSuppliersByZoneChartData = computed(() => {
    const data = this.dashboard();
    if (!data) return { labels: [], datasets: [] };

    const isTon = this.useToneladas();
    const divisor = isTon ? 1000 : 1;

    const supplierMap = new Map<string, { name: string; stock: number }>();
    
    data.zones.forEach(zone => {
      zone.bySupplier.forEach(supplier => {
        const existing = supplierMap.get(supplier.supplierId);
        if (existing) {
          existing.stock += supplier.finalStock;
        } else {
          supplierMap.set(supplier.supplierId, {
            name: supplier.supplierName,
            stock: supplier.finalStock
          });
        }
      });
    });

    const suppliers = Array.from(supplierMap.values())
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10);

    return {
      labels: suppliers.map(s => s.name),
      datasets: [
        {
          label: isTon ? "Stock (ton)" : "Stock (kg)",
          data: suppliers.map(s => isTon ? Math.round(s.stock / divisor) : s.stock),
          backgroundColor: "#8B5CF6"
        }
      ]
    };
  });

  formatWeight(value: number | undefined | null): string {
    if (value == null) return "0";
    if (this.useToneladas()) {
      const tons = value / 1000;
      return `${tons.toLocaleString("es-CO", { maximumFractionDigits: 2 })} ton`;
    }
    return `${value.toLocaleString("es-CO", { maximumFractionDigits: 2 })} ${EWeightUnits.KILOGRAMS}`;
  }
}
