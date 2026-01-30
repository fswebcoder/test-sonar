import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-smelting-start-action',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `<div class="mt-4" *ngIf="show"><svi-button type="button" (onClick)="start.emit()" [icon]="ICONS.SAVE" [disabled]="disabled" label="Iniciar Fundición"></svi-button></div>`
})
export class SmeltingStartActionComponent {
  @Input() show = false;
  @Input() disabled = false;
  @Output() start = new EventEmitter<void>();
  ICONS = ICONS;
}
