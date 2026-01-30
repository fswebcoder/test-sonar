import { ISampleEntity } from '@/domain/entities/lims/management/sample.entity';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisStatus } from '@/domain/entities/lims/analysis/required-analysis.entity';
import { TooltipModule } from 'primeng/tooltip';
import { ICONS } from '@/shared/enums/general.enum';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { formatWeight } from '@/core/utils/format-weight';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { PermissionService } from '@/core/services';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-sample-card',
  imports: [CommonModule, CardButtonComponent, TooltipModule],
  templateUrl: './sample-card.component.html',
  styleUrl: './sample-card.component.scss'
})
export class SampleCardComponent {
  sample = input.required<ISampleEntity>();
  onPrint = output<ISampleEntity>();
  router = inject(Router);
  readonly path = this.router.url;

  private permissionService = inject(PermissionService);
  receptionActions = ReceptionAction

  ICONS = ICONS;
  EWeightUnits = EWeightUnits;
  readonly EActionSeverity = EActionSeverity;

  AnalysisStatus = AnalysisStatus;

  onSelectPrint() {
    if (this.sample()) {
      this.onPrint.emit(this.sample()!);
    }
  }

  navigateToSampleDetail = () => {
    this.router.navigate(['/lims/gestion-muestras', this.sample()?.sampleId]);
  };

  get getWeightReceived(): string {
    return formatWeight(this.sample()?.receivedWeight ?? 0);
  }

  get hasPermissionToSeeSupplier(): boolean {
    return this.permissionService.hasPermission({ path: '/lims/gestion-muestras', action: ReceptionAction.VER_PROVEEDOR_GESTION_MUESTRAS });
  }
}
