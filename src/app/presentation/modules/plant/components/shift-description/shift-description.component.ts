import { IShiftDescription } from "@/domain/entities/plant/shift/shift.entity";
import { Component, input, output } from "@angular/core";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";
import { ECurrentShiftActions } from "@/presentation/modules/plant/modules/actions.enum";
import { PermissionDirective } from "@/core/directives";
import parseUTCTime  from "@/core/utils/parse-UTC-time";
@Component({
  selector: 'svi-shift-description',
  templateUrl: './shift-description.component.html',
  imports: [ButtonComponent, PermissionDirective]
})
export class ShiftDescriptionComponent {

  ICONS = ICONS
  currentShiftActions = ECurrentShiftActions;
  
  onCloseShift = output<void>();

  shiftDescription = input.required<IShiftDescription>();
  path = input.required<string>();

  closeShift() {
    this.onCloseShift.emit();
  }

  getTimeFormatted(time: string): string {
    const date = parseUTCTime(time);
    return date.toLocaleTimeString();
  }
}