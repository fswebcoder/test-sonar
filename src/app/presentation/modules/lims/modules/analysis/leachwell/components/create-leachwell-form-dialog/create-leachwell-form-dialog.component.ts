import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { ILeachwellParamsEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-params.entity';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-create-leachwell-form-dialog',
  imports: [ReactiveFormsModule, ButtonComponent, FloatSelectComponent, SmartScanInputComponent, CommonModule],
  templateUrl: './create-leachwell-form-dialog.component.html',
  styleUrl: './create-leachwell-form-dialog.component.scss'
})
export class CreateLeachwellFormDialogComponent {
  isVisible = signal(false);

  formbuilder = inject(FormBuilder);

  onSave = output<ILeachwellParamsEntity>();
  onCancel = output<void>();

  form!: FormGroup;

  ICONS = ICONS;

  options = [
    {
      label: '1 hora',
      value: 60
    },
    {
      label: '2 horas',
      value: 120
    },
    {
      label: '3 horas',
      value: 180
    },
    {
      label: '4 horas',
      value: 240
    }
  ];

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formbuilder.group({
      sampleCode: [null, Validators.required],
      duration: [null, Validators.required]
    });
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.onSave.emit(this.form.value);
  }

  cancel() {
    this.onCancel.emit();
    this.resetForm();
  }
}
