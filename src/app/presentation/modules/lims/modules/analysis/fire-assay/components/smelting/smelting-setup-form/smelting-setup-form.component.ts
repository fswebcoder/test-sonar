import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { InputNumberComponent } from '@/shared/components/form/input-number/input-number.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import IFurnaceEntity from '@/domain/entities/lims/furnaces/furnace.entity';

@Component({
  selector: 'svi-smelting-setup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatSelectComponent, InputNumberComponent, ButtonComponent],
  templateUrl: './smelting-setup-form.component.html'
})
export class SmeltingSetupFormComponent {
  @Input() form!: FormGroup;
  @Input() furnaces: IFurnaceEntity[] = [];
  @Input() rowsError: any;
  @Input() columnsError: any;
  @Input() weightMode = false;
  @Input() samplesLength = 0;
  @Output() generate = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
  ICONS = ICONS;
  onSubmit(){ if(!this.weightMode) this.generate.emit(); }
  canGenerate(){ return !this.weightMode && this.form.valid; }
  canClear(){ return !this.weightMode && this.samplesLength>0; }
}
