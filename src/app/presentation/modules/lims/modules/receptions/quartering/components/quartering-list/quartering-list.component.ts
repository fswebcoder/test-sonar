import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn, TableAction } from '@/shared/components/table/table.component';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ViewChild } from '@angular/core';
import { IQuarteringItemEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-items.entity';
import { IRequiredAnalysisQuarteringEntity } from '@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';

@Component({
  selector: 'svi-quartering-list',
  imports: [CommonModule, TableComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './quartering-list.component.html',
  styleUrl: './quartering-list.component.scss'
})
export class QuarteringListComponent {
  ICONS = ICONS;

  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  subSamples = input<IQuarteringItemEntity[]>([]);
  requiredAnalysis = input<IRequiredAnalysisQuarteringEntity[]>([]);
  loading = input<boolean>(false);

  receptionAction = ReceptionAction;

  onDeleteQuartering = output<string>();
  onEditQuartering = output<IQuarteringItemEntity>();
  totalQuarteringWeight = computed(() => {
    return this.subSamples().reduce((total, item) => total + item.weight, 0);
  });

  columns: TableColumn[] = [
    {
      field: 'weight',
      header: 'Peso (gr)',
      template: (item: IQuarteringItemEntity) => `${item?.weight || 0} gr`
    },
    {
      field: 'analysisName',
      header: 'Análisis',
      template: (item: IQuarteringItemEntity) => this.getAnalysisName(item)
    },
    {
      field: 'replicatedIndex',
      header: 'Número de análisis',
      type: 'badge',
      badgeSeverity: () => "warn",
      badgeText: (item: number) => `${item}`
    }
  ];

  actions: TableAction[] = [
    {
      icon: ICONS.TRASH,
      tooltip: 'Eliminar',
      action: (item: IQuarteringItemEntity) => this.deleteQuartering(item),
  severity: EActionSeverity.DELETE,
      permission: {
        action: this.receptionAction.CREAR_CUARTEO_ANALISIS,
        path: "/lims/cuarteo-analisis"
      }
    }
  ];

  deleteQuartering(item: IQuarteringItemEntity) {
    this.confirmDialog.show(
      `¿Está seguro que desea eliminar el cuarteo de ${item.weight}gr para el análisis "${item.requiredAnalysisId}"?`,
      () => {
        this.onDeleteQuartering.emit(item.requiredAnalysisId);
      },
      () => {}
    );
  }

  private getAnalysisName(item: IQuarteringItemEntity): string {
    if (!item?.requiredAnalysisId) return '';
    const analysis = this.requiredAnalysis().find(a => a.requiredAnalysisId === item.requiredAnalysisId);
    return `${analysis?.analysisName}` || '';
  }
}
