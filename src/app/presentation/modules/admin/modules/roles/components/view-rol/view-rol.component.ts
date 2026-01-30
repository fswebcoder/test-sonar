import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRoleEntity } from '@/domain/entities/admin/roles/role.entity';
import { IRoleDetailEntity } from '@/domain/entities/admin/roles/role-detail.entity';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { ActionResourcePanelComponent } from '../action-resource-panel/action-resource-panel.component';
import { StatCardComponent } from '@/shared/components/stat-card/stat-card.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-view-rol',
  imports: [CommonModule, ActionResourcePanelComponent, StatCardComponent],
  templateUrl: './view-rol.component.html',
  styleUrl: './view-rol.component.scss'
})
export class ViewRolComponent {
  roleData = input.required<IRoleEntity>();
  roleDetail = input.required<IRoleDetailEntity>();
  actionsPermissions = input.required<IActionEntity[]>();

  ICONS = ICONS;
  Math = Math;

  getRoleActionIds(): string[] {
    const detail = this.roleDetail();
    const actionIds = detail?.actions?.map(action => action.id) || [];
    return Array.from(new Set(actionIds));
  }

  getSelectedActionsCount(): number {
    return this.getRoleActionIds().length;
  }

  getTotalActionsCount(): number {
    return this.actionsPermissions().length;
  }

  getRoleStatus(): string {
    return this.roleData().isActive ? 'Activo' : 'Inactivo';
  }

  getRoleStatusClass(): string {
    return this.roleData().isActive ? 'text-success' : 'text-danger';
  }

  getCoveragePercentage(): number {
    const total = this.getTotalActionsCount();
    if (total === 0) return 0;
    return Math.round((this.getSelectedActionsCount() / total) * 100);
  }

  getCoveragePercentageForProgress(): number {
    const total = this.getTotalActionsCount();
    if (total === 0) return 0;
    return (this.getSelectedActionsCount() / total) * 100;
  }
}
