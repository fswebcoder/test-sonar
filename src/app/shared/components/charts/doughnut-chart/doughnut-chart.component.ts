import { Component, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "primeng/chart";

export interface DoughnutChartDataset {
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  hoverBackgroundColor?: string[];
}

export interface DoughnutChartData {
  labels: string[];
  datasets: DoughnutChartDataset[];
}

export interface DoughnutChartOptions {
  maintainAspectRatio?: boolean;
  cutout?: string;
  plugins?: {
    legend?: {
      position?: "top" | "bottom" | "left" | "right";
      display?: boolean;
      labels?: {
        boxWidth?: number;
        font?: { size?: number };
      };
    };
  };
}

@Component({
  selector: "svi-doughnut-chart",
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="chart-container" [style.height]="height()">
      <p-chart type="doughnut" [data]="data()" [options]="mergedOptions()" [height]="height()" />
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      position: relative;
    }
  `]
})
export class DoughnutChartComponent {
  data = input.required<DoughnutChartData>();
  options = input<DoughnutChartOptions>({});
  height = input<string>("300px");
  compact = input<boolean>(false);

  mergedOptions = computed(() => {
    const customOptions = this.options();
    const isCompact = this.compact();

    return {
      responsive: true,
      maintainAspectRatio: customOptions.maintainAspectRatio ?? false,
      cutout: customOptions.cutout,
      plugins: {
        legend: {
          position: customOptions.plugins?.legend?.position ?? "right",
          display: customOptions.plugins?.legend?.display ?? true,
          labels: isCompact 
            ? { boxWidth: 10, font: { size: 10 } }
            : customOptions.plugins?.legend?.labels
        }
      }
    };
  });
}
