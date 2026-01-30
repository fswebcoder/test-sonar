import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { ChartData, ChartOptions } from 'chart.js';
import {
  IEquipmentSchemaProcessMill,
  ILocationSchemaProcessMill,
  IVariableDataProcessMill,
  IVariableSchemaProcessMill
} from '@/domain/entities/plant/milling/milling-detail.entity';
import { ICONS } from '@/shared/enums/general.enum';
import parseUTCTime from '@/core/utils/parse-UTC-time';
import { KeyValueRow, KeyValueTableComponent } from '@/shared/components/key-value-table/key-value-table.component';

@Component({
  selector: 'svi-milling-detail-equipment-display',
  standalone: true,
  imports: [CommonModule, ChartModule, CardButtonComponent, TagModule, KeyValueTableComponent],
  templateUrl: './milling-detail-equipment-display.component.html',
  styleUrls: ['./milling-detail-equipment-display.component.scss']
})
export class MillingDetailEquipmentDisplayComponent {
  equipment = input.required<IEquipmentSchemaProcessMill>();
  viewMode = input<'detail' | 'charts'>('detail');

  chartData!: ChartData<'line'>;
  chartOptions: ChartOptions<'line'> = this.createChartOptions();
  private readonly averagesVisibility = signal<Record<string, boolean>>({});
  private readonly variableKeys = new WeakMap<IVariableSchemaProcessMill, string>();
  private variableKeyCounter = 0
  readonly ICONS = ICONS

  locations = () => (this.equipment().location ?? []) as ILocationSchemaProcessMill[];
  variables = (location: ILocationSchemaProcessMill) => (location.variables ?? []) as IVariableSchemaProcessMill[];
  dataPoints = (variable: IVariableSchemaProcessMill) => (variable.data ?? []) as IVariableDataProcessMill[];

  variableRows(variable: IVariableSchemaProcessMill): KeyValueRow[] {
    return this.dataPoints(variable).map(point => ({
      left: String(point.value ?? 'N/A'),
      right: this.getTimeFormatted(point.readingTime)
    }));
  }

  buildChartData(variable: IVariableSchemaProcessMill): ChartData {
    const points = this.dataPoints(variable);
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--primary-color').trim();

    const datasets: ChartData<'line'>['datasets'] = [
      {
        label: variable.name,
        data: points.map(point => point.value),
        fill: false,
        tension: 0.3,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        pointBackgroundColor: primaryColor,
        pointBorderColor: primaryColor
      }
    ];

    const averageValue = this.isAverageVisible(variable) ? this.getAverageValue(variable) : null;
    if (averageValue !== null) {
      datasets.push({
        label: `${variable.name} (Promedio)`,
        data: points.map(() => averageValue),
        fill: false,
        tension: 0,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        borderDash: [6, 6],
        pointRadius: 0,
        pointHoverRadius: 0
      });
    }

    return {
      labels: points.map(point => this.getTimeFormatted(point.readingTime)),
      datasets
    };
  }

  private createChartOptions(): ChartOptions<'line'> {
    const style = getComputedStyle(document.documentElement);
    const axisTitleColor = style.getPropertyValue('--text-color').trim() || '#111827';
    const axisLabelColor = style.getPropertyValue('--text-color-secondary').trim() || '#6b7280';
    const gridColor = style.getPropertyValue('--surface-border').trim() || '#e5e7eb';

    return {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 150,
      animation: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hora',
            color: axisTitleColor,
            font: {
              weight: 600,
              size: 12
            }
          },
          ticks: {
            color: axisLabelColor
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          title: {
            display: true,
            text: 'Valor',
            color: axisTitleColor,
            font: {
              weight: 600,
              size: 12
            }
          },
          ticks: {
            color: axisLabelColor
          },
          grid: {
            color: gridColor
          }
        }
      }
    };
  }

  toggleAverage(variable: IVariableSchemaProcessMill): void {
    if (!this.hasDataPoints(variable)) {
      return;
    }
    const key = this.getVariableKey(variable);
    const current = { ...this.averagesVisibility() };
    current[key] = !current[key];
    this.averagesVisibility.set(current);
  }

  isAverageVisible(variable: IVariableSchemaProcessMill): boolean {
    const key = this.getVariableKey(variable);
    return Boolean(this.averagesVisibility()[key]);
  }

  hasDataPoints(variable: IVariableSchemaProcessMill): boolean {
    return this.dataPoints(variable).length > 0;
  }

  getAverageValue(variable: IVariableSchemaProcessMill): number | null {
    const points = this.dataPoints(variable);
    if (!points.length) {
      return null;
    }
    const sum = points.reduce((acc, point) => acc + Number(point.value ?? 0), 0);
    return sum / points.length;
  }

  getAverageLabel(variable: IVariableSchemaProcessMill): string {
    const average = this.getAverageValue(variable);
    if (average === null) {
      return '0';
    }
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(average);
  }

  getTimeFormatted(time: string): string {
    const date = parseUTCTime(time);
    return date.toLocaleTimeString();
  }

  private getVariableKey(variable: IVariableSchemaProcessMill): string {
    if (!this.variableKeys.has(variable)) {
      const fallbackKey = `variable-${this.variableKeyCounter++}`;
      this.variableKeys.set(variable, variable.id ?? variable.name ?? fallbackKey);
    }
    return this.variableKeys.get(variable)!;
  }
}
