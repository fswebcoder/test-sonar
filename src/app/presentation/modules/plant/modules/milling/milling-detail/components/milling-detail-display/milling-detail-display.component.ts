import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { IEquipmentSchemaProcessMill, IMillingRecordEntity } from '@/domain/entities/plant/milling/milling-detail.entity';
import { CollapsiblePanelComponent } from '@/shared/components/collapsible-panel';
import { TimelineModule } from 'primeng/timeline';
import { ICONS } from '@/shared/enums/general.enum';
import { TagModule } from 'primeng/tag';
import { MillingDetailEquipmentDisplayComponent } from '../milling-detail-equipment-display/milling-detail-equipment-display.component';
import { ViewSwitcherComponent, ViewOption } from '@/shared/components/view-switcher/view-switcher.component';
import { TabsComponent } from '@/shared/components/tabs/tabs.component';
import { KeyValueRow, KeyValueTableComponent } from '@/shared/components/key-value-table/key-value-table.component';

@Component({
  selector: 'svi-milling-detail-display',
  standalone: true,
  templateUrl: './milling-detail-display.component.html',
  styleUrls: ['./milling-detail-display.component.scss'],
  imports: [
    CommonModule,
    CollapsiblePanelComponent,
    TimelineModule,
    TabsComponent,
    MillingDetailEquipmentDisplayComponent,
    ViewSwitcherComponent,
    TagModule,
    KeyValueTableComponent
  ]
})
export class MillingDetailDisplayComponent {
  detail = input.required<IMillingRecordEntity>();

  readonly densityKeyOrder: string[] = ['trommel', 'feed', 'overflow', 'underflow', 'tailings'];
  readonly densityLabelMapper: Record<string, string> = {
    trommel: 'Trommel',
    feed: 'Alimento',
    overflow: 'Sobre flujo',
    underflow: 'Bajo flujo',
    tailings: 'Colas'
  };

  readonly reagentKeyOrder: string[] = ['collector', 'promoter', 'frother'];
  readonly reagentLabelMapper: Record<string, string> = {
    collector: 'Colector',
    promoter: 'Promotor',
    frother: 'Espumante'
  };

  densityAveragesRecord(): Record<string, unknown> | null {
    const density = this.detail().millControlTracking?.densityAverages;
    return density ? ({ ...density } as Record<string, unknown>) : null;
  }

  reagentAveragesRecord(): Record<string, unknown> | null {
    const reagent = this.detail().millControlTracking?.reagentAverages;
    return reagent ? ({ ...reagent } as Record<string, unknown>) : null;
  }

  readonly ICONS = ICONS;
  readonly viewOptions: ViewOption[] = [
    { value: 'detail', label: 'Detalle', icon: ICONS.DETAIL_VIEW },
    { value: 'charts', label: 'Gráficos', icon: ICONS.CHART_BAR }
  ];

  activeTab = signal<string | null>(null);
  viewMode = signal<'detail' | 'charts'>('detail');
  equipmentTabValueAccessor = (equipment: IEquipmentSchemaProcessMill, index: number) => this.equipmentTabValue(equipment, index);

  equipmentList = () => (this.detail().equipmentSchemaProcessMill ?? []) as IEquipmentSchemaProcessMill[];

  constructor() {
    effect(() => {
      const equipments = this.equipmentList();
      if (!equipments.length) {
        this.activeTab.set(null);
        return;
      }

      const current = this.activeTab();
      const values = equipments.map((equipment, index) => this.equipmentTabValue(equipment, index));
      if (!current || !values.includes(current)) {
        this.activeTab.set(values[0]);
      }
    });
  }

  onTabChange(value: string | number | null) {
    if (value === null || value === undefined) return;
    this.activeTab.set(value.toString());
  }

  onViewModeChange(mode: string) {
    if (mode === 'detail' || mode === 'charts') {
      this.viewMode.set(mode);
    }
  }

  firstEquipmentTab() {
    const equipments = this.equipmentList();
    return equipments.length ? this.equipmentTabValue(equipments[0], 0) : '';
  }

  equipmentTabValue(equipment: IEquipmentSchemaProcessMill, index: number) {
    const identifier = equipment.id ?? index;
    return `equipment-${identifier}`;
  }

  formatDateWithoutYear(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hour}:${minutes}`;
  }

  controlSummaryRows(): KeyValueRow[] {
    const control = this.detail().millControlTracking;
    return [
      { left: 'Tonelaje molido', right: String(control?.milledTonnage ?? 'N/A') },
      { left: 'Frecuencia promedio (Hz)', right: String(control?.frequencyAverage?.averageHz ?? 'N/A') }
    ];
  }

  controlDensityRows(): KeyValueRow[] {
    const density = this.detail().millControlTracking?.densityAverages;
    return [
      { left: 'Trommel', right: String(density?.trommel ?? 'N/A') },
      { left: 'Alimentación', right: String(density?.feed ?? 'N/A') },
      { left: 'Sobre flujo', right: String(density?.overflow ?? 'N/A') },
      { left: 'Bajo flujo', right: String(density?.underflow ?? 'N/A') },
      { left: 'Relaves', right: String(density?.tailings ?? 'N/A') }
    ];
  }

  controlReagentRows(): KeyValueRow[] {
    const reagent = this.detail().millControlTracking?.reagentAverages;
    return [
      { left: 'Colector', right: String(reagent?.collector ?? 'N/A') },
      { left: 'Promotor', right: String(reagent?.promoter ?? 'N/A') },
      { left: 'Espumante', right: String(reagent?.frother ?? 'N/A') }
    ];
  }
}
