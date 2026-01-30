import { IAreasOfOperation, IAreasOfOperationConfig } from "@/domain/entities/plant/shift/shift.entity";
import { Component, computed, input, output } from "@angular/core";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { PersonnelRegisterComponent } from "../personnel-register/personnel-register.component";
import IPersonnelEntity, { IPersonnelShiftConfigEntity } from "@/domain/entities/plant/shift/personnel.entity";
import { ECurrentShiftActions, EShiftConfigActions } from "@/presentation/modules/plant/modules/actions.enum";
import { PermissionDirective } from "@/core/directives";
import { IShiftActions } from "@/shared/interfaces/shift-actions.interface";

@Component({
  selector: 'svi-shift-area',
  templateUrl: './shift-area.component.html',
  imports: [ButtonComponent, EmptyStateComponent, PersonnelRegisterComponent, PermissionDirective],
})
export class ShiftAreaComponent {
  ICONS = ICONS

  isConfig = input<boolean>(false)
  actions = computed<IShiftActions>(() => {
    if (this.isConfig()) {
      return {
        AGREGAR_PERSONAL: EShiftConfigActions.AGREGAR_PERSONAL_CONFIGURACION_TURNO,
        ELIMINAR_PERSONAL: EShiftConfigActions.ELIMINAR_PERSONAL_CONFIGURACION_TURNO,
      }
    } else {
      return {
        AGREGAR_PERSONAL: ECurrentShiftActions.AGREGAR_PERSONAL_TURNO,
        ELIMINAR_PERSONAL: ECurrentShiftActions.ELIMINAR_PERSONAL_TURNO,
      }
    }
  })




  area = input.required<IAreasOfOperation | IAreasOfOperationConfig>();
  path = input.required<string>();

  onShowAddPersonnel = output<string>();
  onDeletePersonnel = output<IPersonnelEntity | IPersonnelShiftConfigEntity>();


  showAddPersonnel(areaId: string) {
    this.onShowAddPersonnel.emit(areaId);
  }

  deletePersonnel(person: IPersonnelEntity | IPersonnelShiftConfigEntity) {
    this.onDeletePersonnel.emit(person);
  }
}