import { ISampleEntity } from '@/domain/entities/lims/management/sample.entity';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AnalysisStatus } from '@/domain/entities/lims/analysis/required-analysis.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { Router } from '@angular/router';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { formatWeight } from '@/core/utils/format-weight';
import { PermissionService } from '@/core/services';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-sample-expanded-content',
  standalone: true,
  imports: [CommonModule, TagModule, TooltipModule, CardButtonComponent],
  templateUrl: './sample-expanded-content.component.html',
  styleUrl: './sample-expanded-content.component.scss'
})
export class SampleExpandedContentComponent {
  sample = input.required<ISampleEntity>();

  ICONS = ICONS;
  EWeightUnits = EWeightUnits;
  ReceptionAction = ReceptionAction;
  readonly EActionSeverity = EActionSeverity;

  onViewDetails = output<string>();
  onPrint = output<ISampleEntity>();

  AnalysisStatus = AnalysisStatus;

  private permissionService = inject(PermissionService);
  router = inject(Router);
  readonly path = this.router.url;  
  onViewDetailsClick(sampleId: string) {
    this.onViewDetails.emit(sampleId);
  }

  onPrintClick(sample: ISampleEntity) {
    this.onPrint.emit(sample);
  }

  get getWeightReceived(): string {
    return formatWeight(this.sample()?.receivedWeight ?? 0);
  }

  get hasPermissionToSeeSupplier(): boolean {
    return this.permissionService.hasPermission({ path: '/lims/gestion-muestras', action: ReceptionAction.VER_PROVEEDOR_GESTION_MUESTRAS });
  }
}
