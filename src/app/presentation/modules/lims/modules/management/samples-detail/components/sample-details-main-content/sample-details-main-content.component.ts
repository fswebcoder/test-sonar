import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { SampleDetailListCard } from '../sample-detail-list-card/sample-detail-list-card.component';
import { TooltipModule } from 'primeng/tooltip';
import { ICONS } from '@/shared/enums/general.enum';
import ISampleDetailEntity from '@/domain/entities/lims/management/sample-detail.entity';
import { ESampleDetailRequiredAnalysisStatus } from '@/shared/enums/sample-detail-required-analysis-status.enum';
import ISampleDetailRequiredAnalysesEntity from '@/domain/entities/lims/management/sample-detail-required-analyses.entity';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { TSeverityType } from '@/shared/types/severity-type.type';
import { formatWeight } from '@/core/utils/format-weight';
import { ButtonComponent } from '@/shared/components/form/button/button.component';

@Component({
  selector: 'svi-sample-details-main-content',
  imports: [CommonModule, TagModule, SampleDetailListCard, TooltipModule, ButtonComponent],
  templateUrl: './sample-details-main-content.component.html',
  styleUrl: './sample-details-main-content.component.scss'
})
export class SampleDetailsMainContentComponent {
  sampleDetail = input<ISampleDetailEntity>();
  onSelectResult = output<any>();
  onPrintQuartering = output<string>();
  onPrintBulkQuartering = output<void>();
  EWeightUnits = EWeightUnits;

  ESampleDetailRequiredAnalysisStatus = ESampleDetailRequiredAnalysisStatus;

  formatWeight = formatWeight;

  ICONS = ICONS;
  verResultados(analysis: any): void {
    this.onSelectResult.emit(analysis);
  }

  printQuartering(quarteringId: string): void {
    this.onPrintQuartering.emit(quarteringId);
  }

  printBulkQuartering(): void {
    this.onPrintBulkQuartering.emit();
  }

  getStatusColor(analysis: ISampleDetailRequiredAnalysesEntity): TSeverityType {
    return analysis.status === ESampleDetailRequiredAnalysisStatus.COMPLETED
      ? 'success'
      : analysis.status === ESampleDetailRequiredAnalysisStatus.PROCESSING
        ? 'warn'
        : 'danger';
  }

  getStatusLabel(analysis: ISampleDetailRequiredAnalysesEntity): string {
    return analysis.status === ESampleDetailRequiredAnalysisStatus.COMPLETED
      ? 'Ver resultado'
      : analysis.status === ESampleDetailRequiredAnalysisStatus.PROCESSING
        ? 'En proceso'
        : 'Pendiente';
  }

  selectResult(analysis: ISampleDetailRequiredAnalysesEntity): void {
    if (analysis.analyses && analysis.analyses.some(a => a.resultValue !== null && a.resultValue !== undefined)) {
      this.onSelectResult.emit(analysis);
    }
  }
}
