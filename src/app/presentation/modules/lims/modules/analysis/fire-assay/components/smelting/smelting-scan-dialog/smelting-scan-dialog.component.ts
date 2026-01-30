import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';

@Component({
  selector: 'svi-smelting-scan-dialog',
  standalone: true,
  imports: [DialogComponent, ReactiveFormsModule, SmartScanInputComponent, FloatInputComponent, ButtonComponent],
  templateUrl: './smelting-scan-dialog.component.html'
})
export class SmeltingScanDialogComponent {
  @Input() visible = false;
  @Input() weightMode = false;
  @Input() scanForm!: FormGroup;
  @Input() weightForm!: FormGroup;
  @Input() weightFieldName: string = 'regulusWeight';
  @Input() weightHeader: string = 'Asignar Peso régulo';
  @Input() weightInputLabel: string = 'Peso (g)';
  @Input() units = EWeightUnits.GRAMS;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  ICONS = ICONS;
  onAccept(){ this.confirm.emit(); }
  onCancel(){ this.cancel.emit(); }
  onVisible(v:boolean){ this.visibleChange.emit(!!v); }
}
