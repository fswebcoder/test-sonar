import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

import { DatePikerComponent } from '@/shared/components/form/date-piker/date-piker.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { StatCardComponent } from '@/shared/components/stat-card/stat-card.component';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { LineChartComponent, LineChartData, LineChartOptions } from '@/shared/components/charts';
import { ChartGroupBy, ISupplierDashboardResponse } from '@/domain/entities/suppliers/admin/dashboard/supplier-dashboard.entity';
import { MetricCardComponent } from "@/presentation/modules/lims/modules/management/samples-detail/components/metric-card/metric-card.component";

interface GroupByOption {
  label: string;
  value: ChartGroupBy;
}

@Component({
  selector: 'svi-supplier-dashboard-dump',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectButton,
    DatePikerComponent,
    ButtonComponent,
    StatCardComponent,
    EmptyStateComponent,
    LineChartComponent,
    MetricCardComponent
],
  templateUrl: './supplier-dashboard-dump.component.html',
  styleUrl: './supplier-dashboard-dump.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierDashboardDumpComponent {
  dashboard = input<ISupplierDashboardResponse | null>(null);
  isLoadingRefresh = input<boolean>(false);
  startDate = input<Date | null>(null);
  endDate = input<Date | null>(null);
  groupBy = input<ChartGroupBy>(ChartGroupBy.DAY);

  startDateChange = output<Date | null>();
  endDateChange = output<Date | null>();
  groupByChange = output<ChartGroupBy>();
  refresh = output<void>();

  readonly groupByOptions: GroupByOption[] = [
    { label: 'Día', value: ChartGroupBy.DAY },
    { label: 'Semana', value: ChartGroupBy.WEEK },
    { label: 'Mes', value: ChartGroupBy.MONTH }
  ];

  readonly chartOptions: LineChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Peso (kg)' }
      },
      y1: {
        beginAtZero: true,
        title: { display: true, text: 'Entregas' }
      }
    }
  };

  chartData = computed<LineChartData | null>(() => {
    const data = this.dashboard();
    if (!data?.chart?.length) {
      return null;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--primary-color').trim() || '#3b82f6';
    const successColor = '#22c55e';

    return {
      labels: data.chart.map(point => point.label),
      datasets: [
        {
          label: 'Peso Entregado (kg)',
          data: data.chart.map(point => point.weight),
          fill: true,
          backgroundColor: `${primaryColor}20`,
          borderColor: primaryColor,
          tension: 0.3,
          yAxisID: 'y',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2
        },
        {
          label: 'Entregas',
          data: data.chart.map(point => point.deliveries),
          fill: false,
          backgroundColor: successColor,
          borderColor: successColor,
          tension: 0.3,
          yAxisID: 'y1',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2
        }
      ]
    };
  });

  formatWeight(value: number): string {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} ton`;
    }
    return `${value.toFixed(2)} kg`;
  }

  formatDate(date: Date | null): string {
    if (!date) {
      return 'Sin entregas';
    }
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
