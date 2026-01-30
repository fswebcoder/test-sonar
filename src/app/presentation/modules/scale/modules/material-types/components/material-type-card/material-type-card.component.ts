import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { IMaterialTypeEntity } from '@/domain/entities/scale/material-types/material-type.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { ScaleActions } from '@scale/modules/actions.enum';
import { ScaleCardComponent } from '@/shared/components/scale-card/scale-card.component';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

@Component({
  selector: 'svi-material-type-card',
  standalone: true,
  imports: [CommonModule, CardButtonComponent, ScaleCardComponent],
  templateUrl: './material-type-card.component.html',
  styleUrl: './material-type-card.component.scss'
})
export class MaterialTypeCardComponent {
  materialType = input.required<IMaterialTypeEntity>();
  path = input.required<string>();

  onView = output<IMaterialTypeEntity>();
  onEdit = output<IMaterialTypeEntity>();
  onActivate = output<IMaterialTypeEntity>();
  onDeactivate = output<IMaterialTypeEntity>();

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;
  readonly EActionSeverity = EActionSeverity;

  statusLabel = computed(() => (this.materialType().isActive ? 'Activo' : 'Inactivo'));
  statusType = computed(() => (this.materialType().isActive ? 'active' : 'inactive'));

  handleView(): void {
    this.onView.emit(this.materialType());
  }

  handleEdit(): void {
    this.onEdit.emit(this.materialType());
  }

  handleActivate(): void {
    this.onActivate.emit(this.materialType());
  }

  handleDeactivate(): void {
    this.onDeactivate.emit(this.materialType());
  }
}
