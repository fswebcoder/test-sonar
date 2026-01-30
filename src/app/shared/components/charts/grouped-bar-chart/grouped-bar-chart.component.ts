import { Component, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "primeng/chart";

export interface GroupedBarChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  yAxisID?: string;
}

export interface GroupedBarChartData {
  labels: string[];
  datasets: GroupedBarChartDataset[];
}

export interface GroupedBarChartAxis {
  type?: "linear";
  display?: boolean;
  position?: "left" | "right";
  beginAtZero?: boolean;
  title?: { display?: boolean; text?: string };
  grid?: { drawOnChartArea?: boolean };
}

export interface GroupedBarChartOptions {
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: "top" | "bottom" | "left" | "right";
      display?: boolean;
    };
  };
  scales?: {
    y?: GroupedBarChartAxis;
    y1?: GroupedBarChartAxis;
  };
}

@Component({
  selector: "svi-grouped-bar-chart",
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
export class GroupedBarChartComponent {
  data = input.required<GroupedBarChartData>();
  options = input<GroupedBarChartOptions>({});
  height = input<string>("300px");
  dualAxis = input<boolean>(false);
  leftAxisLabel = input<string>("");
  rightAxisLabel = input<string>("");

  mergedOptions = computed(() => {
    const customOptions = this.options();
    
    if (this.dualAxis()) {
      return {
        responsive: true,
        maintainAspectRatio: customOptions.maintainAspectRatio ?? false,
        plugins: {
          legend: {
            position: customOptions.plugins?.legend?.position ?? "bottom",
            display: customOptions.plugins?.legend?.display ?? true
          }
        },
        scales: {
          y: {
            type: "linear" as const,
            display: true,
            position: "left" as const,
            beginAtZero: true,
            title: {
              display: !!this.leftAxisLabel(),
              text: this.leftAxisLabel()
            }
          },
          y1: {
            type: "linear" as const,
            display: true,
            position: "right" as const,
            beginAtZero: true,
            title: {
              display: !!this.rightAxisLabel(),
              text: this.rightAxisLabel()
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      };
    }

    return {
      responsive: true,
      maintainAspectRatio: customOptions.maintainAspectRatio ?? false,
      plugins: {
        legend: {
          position: customOptions.plugins?.legend?.position ?? "bottom",
          display: customOptions.plugins?.legend?.display ?? true
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };
  });
}
