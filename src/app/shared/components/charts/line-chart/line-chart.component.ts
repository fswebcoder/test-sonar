import { Component, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "primeng/chart";

export interface LineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
  yAxisID?: 'y' | 'y1';
  pointRadius?: number;
  pointHoverRadius?: number;
  borderWidth?: number;
}

export interface LineChartData {
  labels: string[];
  datasets: LineChartDataset[];
}

export interface LineChartAxisOptions {
  beginAtZero?: boolean;
  title?: { display?: boolean; text?: string };
  display?: boolean;
  position?: 'left' | 'right';
  grid?: { drawOnChartArea?: boolean };
}

export interface LineChartOptions {
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: "top" | "bottom" | "left" | "right";
      display?: boolean;
    };
  };
  scales?: {
    y?: LineChartAxisOptions;
    y1?: LineChartAxisOptions;
    x?: {
      title?: { display?: boolean; text?: string };
    };
  };
}

@Component({
  selector: "svi-line-chart",
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="chart-container" [style.height]="height()">
      <p-chart type="line" [data]="data()" [options]="mergedOptions()" [height]="height()" />
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      position: relative;
    }
  `]
})
export class LineChartComponent {
  data = input.required<LineChartData>();
  options = input<LineChartOptions>({});
  height = input<string>("300px");

  mergedOptions = computed(() => {
    const customOptions = this.options();
    const hasSecondAxis = this.data().datasets.some(ds => ds.yAxisID === 'y1');
    
    const scales: Record<string, unknown> = {
      y: {
        beginAtZero: customOptions.scales?.y?.beginAtZero ?? true,
        position: 'left',
        ...customOptions.scales?.y
      },
      x: { ...customOptions.scales?.x }
    };

    if (hasSecondAxis) {
      scales['y1'] = {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: customOptions.scales?.y1?.beginAtZero ?? true,
        grid: {
          drawOnChartArea: false
        },
        ...customOptions.scales?.y1
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
      scales
    };
  });
}
