import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';

@Component({
  selector: 'svi-mine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatInputComponent, ButtonComponent],
  templateUrl: './mine-form.component.html'
})
export class MineFormComponent {
  dismiss = output<void>();
  create = output<{ name: string }>();

  readonly form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });

  get nameControl(): FormControl<string> {
    return this.form.get('name') as FormControl<string>;
  }

  resetForm(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.nameControl.setValue('', { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = (this.nameControl.value || '').trim();
    if (!name) {
      this.form.markAllAsTouched();
      return;
    }

    this.create.emit({ name });
  }
}
