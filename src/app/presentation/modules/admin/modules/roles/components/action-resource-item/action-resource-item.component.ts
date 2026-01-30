import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { CheckboxComponent } from "@/shared/components/form/checkbox/checkbox.component";
import { FormsModule } from '@angular/forms';
import { CollapsiblePanelComponent } from '@/shared/components/collapsible-panel/collapsible-panel.component';
import { ICONS } from '@/shared/enums/general.enum';

interface IActionGroup {
  resourceId: string;
  resourceName: string;
  resourceDescription: string | null;
  actions: IActionEntity[];
  selectedCount: number;
  totalCount: number;
}

@Component({
  selector: 'svi-action-resource-item',
  imports: [CommonModule, ButtonModule, RippleModule, CollapsiblePanelComponent, CheckboxComponent, FormsModule],
  templateUrl: './action-resource-item.component.html',
  styleUrl: './action-resource-item.component.scss'
})
export class ActionResourceItemComponent {
  group = input.required<IActionGroup>();
  selectedActionIds = input.required<string[]>();

  isSelfParent = input<boolean>(false);
  isReadOnly = input<boolean>(false);
  actionsChange = output<string[]>();
  protectedActions = input.required<string[]>();
  ICONS = ICONS;

  selectAllActionsForResource() {
    const groupActionIds = this.group().actions.map(action => action.id);
    const allSelected = groupActionIds.every((id: string) => this.selectedActionIds().includes(id));

    if (allSelected) {
      const newSelected = this.selectedActionIds().filter((id: string) => !groupActionIds.includes(id));
      this.actionsChange.emit(newSelected);
    } else {
      const newSelected = [...new Set([...this.selectedActionIds(), ...groupActionIds])];
      this.actionsChange.emit(newSelected);
    }
  }

  areAllActionsSelectedForResource(): boolean {
    return this.group().selectedCount === this.group().totalCount;
  }

  areSomeActionsSelectedForResource(): boolean {
    return this.group().selectedCount > 0;
  }

  toggleAction(actionId: string) {
    const isSelected = this.selectedActionIds().includes(actionId);

    if (isSelected) {
      if (this.isProtectedAction(actionId)) {
        return;
      }
      const newSelected = this.selectedActionIds().filter((id: string) => id !== actionId);
      this.actionsChange.emit(newSelected);
    } else {
      const newSelected = [...this.selectedActionIds(), actionId];
      this.actionsChange.emit(newSelected);
    }
  }

  isActionSelected(actionId: string): boolean {
    return this.selectedActionIds().includes(actionId);
  }

  isProtectedAction(actionId: string): boolean {
    return this.protectedActions().includes(actionId);
  }
}
