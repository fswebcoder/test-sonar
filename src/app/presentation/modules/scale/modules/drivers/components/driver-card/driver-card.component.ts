import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { ScaleActions } from '@scale/modules/actions.enum';
import { ScaleCardComponent } from '@/shared/components/scale-card/scale-card.component';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'svi-driver-card',
  standalone: true,
  imports: [CommonModule, CardButtonComponent, ScaleCardComponent, MenuModule],
  templateUrl: './driver-card.component.html',
  styleUrl: './driver-card.component.scss'
})
export class DriverCardComponent {
  driver = input.required<IDriverEntity>();
  path = input.required<string>();

  onViewCc = output<IDriverEntity>();
  onViewArl = output<IDriverEntity>();
  onEdit = output<IDriverEntity>();
  onActivate = output<IDriverEntity>();
  onDeactivate = output<IDriverEntity>();

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;
  readonly EActionSeverity = EActionSeverity;

  statusLabel = computed(() => (this.driver().isActive ? 'Activo' : 'Inactivo'));
  statusType = computed(() => (this.driver().isActive ? 'active' : 'inactive'));

  hasAnyDocument = computed(() => {
    const documents = this.driver().documents;
    return Boolean(documents.ccUrl || documents.arlUrl);
  });

  documentMenuItems = computed<MenuItem[]>(() => {
    const documents = this.driver().documents;

    return [
      {
        label: 'Documento',
        icon: ICONS.DOCUMENT,
        disabled: !documents.ccUrl,
        command: () => this.handleViewCc()
      },
      {
        label: 'ARL',
        icon: ICONS.DOCUMENT,
        disabled: !documents.arlUrl,
        command: () => this.handleViewArl()
      }
    ];
  });

  handleViewCc(): void {
    this.onViewCc.emit(this.driver());
  }

  handleViewArl(): void {
    this.onViewArl.emit(this.driver());
  }

  handleEdit(): void {
    this.onEdit.emit(this.driver());
  }

  handleActivate(): void {
    this.onActivate.emit(this.driver());
  }

  handleDeactivate(): void {
    this.onDeactivate.emit(this.driver());
  }
}
