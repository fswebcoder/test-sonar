import IPersonnelEntity, { IPersonnelShiftConfigEntity } from "@/domain/entities/plant/shift/personnel.entity";
import { ICONS } from "@/shared/enums/general.enum";
import { Component, input, output } from "@angular/core";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { TooltipModule } from "primeng/tooltip";
import { PermissionDirective } from "@/core/directives";
import { IShiftActions } from "@/shared/interfaces/shift-actions.interface";

@Component({
  selector: 'svi-personnel-register',
  template: `
  <div class="card flex align-items-center gap-3 p-3 mb-3 border-round surface-card shadow-1 hover:shadow-3 transition-shadow">
        <div class="w-3rem h-3rem border-circle bg-primary-100 text-primary flex align-items-center justify-content-center font-bold">
          {{ getInitials() }}
        </div>
        <div class="flex flex-column flex-1 min-w-0">
          <div class="flex align-items-center gap-2">
            <i class="{{ICONS.CHECK_USER}} text-primary"></i>
            <span class="font-semibold text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ person().name }} {{ person().lastName }}</span>
          </div>
          <div class="mt-1">
            <span class="text-xs px-2 py-1 border-round bg-primary-50 text-primary font-medium">{{ person().position }}</span>
          </div>
        </div>
        <div class="ml-auto flex align-items-center">
          <svi-button
            [appPermission]="{ path: this.path(), action: this.actions().ELIMINAR_PERSONAL }"
            icon="{{ICONS.TRASH}}"
            size="small"
            severity="danger"
            pTooltip="Eliminar personal"
            tooltipPosition="bottom"
            (click)="deletePersonnel()"
          ></svi-button>
        </div>
      </div>
      `,
  imports: [ButtonComponent, TooltipModule, PermissionDirective]
})
export class PersonnelRegisterComponent {
  person = input.required<IPersonnelEntity | IPersonnelShiftConfigEntity>()
  onDeletePersonnel = output<IPersonnelEntity | IPersonnelShiftConfigEntity>()
  path = input.required<string>()
  actions = input.required<IShiftActions>()

  ICONS = ICONS

  deletePersonnel() {
    this.onDeletePersonnel.emit(this.person());
  }

  getInitials(): string {
    const p = this.person();
    const n = (p?.name || '').trim();
    const l = (p?.lastName || '').trim();
    return `${n.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }
}