import { Component, input, output, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { FormMode } from '@/shared/types/form-mode.type';
import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';

@Component({
  selector: 'svi-mine-form',
  imports: [ReactiveFormsModule, FloatInputComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 p-4">
      <svi-float-input 
        formControlName="name" 
        label="Nombre" 
        [required]="mode() !== 'view'"
        [disabled]="mode() === 'view'"
      ></svi-float-input>
      <div class="flex justify-content-end gap-2">
        <svi-button 
          type="button" 
          severity="secondary" 
          icon="{{ ICONS.CANCEL }}" 
          (click)="cancel()" 
          [label]="mode() === 'view' ? 'Cerrar' : 'Cancelar'">
        </svi-button>
        @if (mode() !== 'view') {
          <svi-button 
            icon="{{ ICONS.SAVE }}" 
            type="submit" 
            [disabled]="form.invalid" 
            label="Guardar">
          </svi-button>
        }
      </div>
    </form>
  `,
})
export class MineFormComponent {
  mode = input<FormMode>('create');
  mine = input<IMineEntity | null>(null);

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ])
  });

  onCreate = output<{ name: string }>();
  onEdit = output<{ id: string; name: string }>();
  onCancel = output<void>();

  ICONS = ICONS;

  constructor() {
    effect(() => {
      const mineData = this.mine();
      if (mineData) {
        this.form.patchValue({ name: mineData.name });
      } else {
        this.form.reset();
      }
    });
  }

  cancel(): void {
    this.form.reset();
    this.onCancel.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const currentMode = this.mode();
    const mineData = this.mine();

    if (currentMode === 'edit' && mineData) {
      this.onEdit.emit({ id: mineData.id, name: formValue.name! });
    } else {
      this.onCreate.emit({ name: formValue.name! });
    }
    
    this.form.reset();
  }
}
