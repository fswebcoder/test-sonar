import { Component, computed, input } from '@angular/core';
import { MetricCardComponent } from "../metric-card/metric-card.component";
import ISampleDetailEntity from '@/domain/entities/lims/management/sample-detail.entity';
import { ESampleDetailRequiredAnalysisStatus } from '@/shared/enums/sample-detail-required-analysis-status.enum';

@Component({
  selector: 'svi-sample-details-metrics',
  imports: [MetricCardComponent],
  templateUrl: './sample-details-metrics.component.html',
  styleUrl: './sample-details-metrics.component.scss'
})
export class SampleDetailsMetricsComponent {
  sampleDetail = input.required<ISampleDetailEntity>();
  completedCount = computed(() => (
    (this.sampleDetail()?.requiredAnalyses ?? [])
      .filter(a => a.status === ESampleDetailRequiredAnalysisStatus.COMPLETED).length
  ));
  inProgressCount = computed(() => (
    (this.sampleDetail()?.requiredAnalyses ?? [])
      .filter(a => a.status === ESampleDetailRequiredAnalysisStatus.PROCESSING).length
  ));

  totalRequiredCount = computed(() => (this.sampleDetail()?.requiredAnalyses ?? []).length);
  quarteringsCount = computed(() => {
    const q: any = (this.sampleDetail() as any)?.quartering;
    return Array.isArray(q) ? q.length : 0;
  });

  getAnalysisProgress(): string {
    const requiredAnalyses = this.sampleDetail()?.requiredAnalyses;
    if (!requiredAnalyses || requiredAnalyses.length === 0) {
      return '0';
    }

    const percentage = ((this.completedCount() ?? 0) / requiredAnalyses.length) * 100;
    return percentage.toFixed(0);
  }
}
