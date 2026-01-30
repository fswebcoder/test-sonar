import { Component, effect, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { ICompletePendingReceptionParamsEntity } from '@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity';
import { SampleWeightComponent } from '@/shared/components/sample-weight/sample-weight.component';

@Component({
  selector: 'svi-complete-pending-reception-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, SampleWeightComponent],
  templateUrl: './complete-pending-reception-form.component.html'
})
export class CompletePendingReceptionFormComponent {
  sampleCode = input<string>('');
  weight = input<number | null>(null);
  allowManualWeight = input<boolean>(false);
  isReadingWeight = input<boolean>(false);

  submitForm = output<ICompletePendingReceptionParamsEntity>();
  cancel = output<void>();
  readWeight = output<void>();

  form: FormGroup;
  ICONS = ICONS;
  isSubmitting = signal(false);
  weightControl: FormControl<number | null>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      receivedWeight: [null, [Validators.required, Validators.min(0)]],
    });

    this.weightControl = this.form.get('receivedWeight') as FormControl<number | null>;

    effect(() => {
      const externalWeight = this.weight();
      const current = this.weightControl.value;
      if (externalWeight === current) return;
      this.weightControl.setValue(externalWeight, { emitEvent: false });
    });
  }

  get isSubmitDisabled(): boolean {
    return this.isReadingWeight() || this.isSubmitting() || this.weightControl.value === null || this.form.invalid || this.weightControl.value <= 0;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const value = this.form.value as Pick<ICompletePendingReceptionParamsEntity, 'receivedWeight'>;
    this.submitForm.emit({
      sampleCode: this.sampleCode(),
      receivedWeight: value.receivedWeight,
    });
    this.isSubmitting.set(false);
  }

  onCancel() {
    this.cancel.emit();
  }

  onReadWeight() {
    this.readWeight.emit();
  }
}
