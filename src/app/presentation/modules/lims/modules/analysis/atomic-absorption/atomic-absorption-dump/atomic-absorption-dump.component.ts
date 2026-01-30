import { PermissionDirective } from '@/core/directives';
import { IAtomicAbsorptionParamsEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';
import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'svi-atomic-absorption-dump',
  imports: [SmartScanInputComponent, FileInputComponent, ReactiveFormsModule, ButtonComponent, PermissionDirective],
  templateUrl: './atomic-absorption-dump.component.html',
  styleUrl: './atomic-absorption-dump.component.scss'
})
export class AtomicAbsorptionDumpComponent {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;
  onSaveAtomicAbsorption = output<IAtomicAbsorptionParamsEntity>();
  router = inject(Router);
  readonly path = this.router.url;
  constructor() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      sampleId: [null, Validators.required],
      file: [null, Validators.required]
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
    this.onSaveAtomicAbsorption.emit(this.form.value);
  }
}
