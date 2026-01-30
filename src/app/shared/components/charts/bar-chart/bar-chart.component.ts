import { Component, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "primeng/chart";

export interface BarChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  yAxisID?: string;
}

export interface BarChartData {
  labels: string[];
  datasets: BarChartDataset[];
}

export type BarChartOrientation = "vertical" | "horizontal";

export interface BarChartOptions {
  maintainAspectRatio?: boolean;
  indexAxis?: "x" | "y";
  plugins?: {
    legend?: {
      position?: "top" | "bottom" | "left" | "right";
      display?: boolean;
    };
  };
  scales?: Record<string, unknown>;
}

@Component({
  selector: "svi-bar-chart",
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="chart-container" [style.height]="height()">
      <p-chart type="bar" [data]="data()" [options]="mergedOptions()" [height]="height()" />
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      position: relative;
    }
  `]
})
export class BarChartComponent {
  data = input.required<BarChartData>();
  options = input<BarChartOptions>({});
  height = input<string>("300px");
  orientation = input<BarChartOrientation>("vertical");
  showLegend = input<boolean>(false);

  mergedOptions = computed(() => {
    const customOptions = this.options();
    const isHorizontal = this.orientation() === "horizontal";
    
    return {
      responsive: true,
      maintainAspectRatio: customOptions.maintainAspectRatio ?? false,
      indexAxis: isHorizontal ? ("y" as const) : ("x" as const),
      plugins: {
        legend: {
          display: this.showLegend() || (customOptions.plugins?.legend?.display ?? false),
          position: customOptions.plugins?.legend?.position ?? "bottom"
        }
      },
      scales: customOptions.scales ?? {
        [isHorizontal ? "x" : "y"]: { beginAtZero: true }
      }
    };
  });
}
