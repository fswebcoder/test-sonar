import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';

@Component({
  selector: 'svi-duplicate-sample-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatInputComponent, CheckboxComponent, ButtonComponent],
  templateUrl: './duplicate-sample-form.component.html',
  styleUrl: './duplicate-sample-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DuplicateSampleFormComponent {
  private readonly fb = inject(FormBuilder);

  visible = input<boolean>(false);
  loading = input<boolean>(false);
  sampleCode = input<string | null>(null);
  defaultWeight = input<number | null>(null);

  visibleChange = output<boolean>();
  save = output<Pick<IRepeateSampleParamsEntity, 'receivedWeight' | 'moistureDetermination'>>();

  form = this.fb.nonNullable.group({
    receivedWeight: [null as number | null, [Validators.required, Validators.min(0.0001)]],
    moistureDetermination: [false]
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        const weight = this.defaultWeight();
        this.form.reset({
          receivedWeight: typeof weight === 'number' ? Number(weight) : null,
          moistureDetermination: false
        });
      }
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { receivedWeight, moistureDetermination } = this.form.getRawValue();
    this.save.emit({
      receivedWeight: Number(receivedWeight),
      moistureDetermination: !!moistureDetermination
    });
  }

  handleCancel(): void {
    this.visibleChange.emit(false);
  }

  resetForm(): void {
    this.form.reset({
      receivedWeight: null,
      moistureDetermination: false
    });
  }
}
