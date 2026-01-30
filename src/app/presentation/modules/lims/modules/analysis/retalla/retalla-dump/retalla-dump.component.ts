import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { IRetallaParamsEntity } from '@/domain/entities/lims/analysis/retalla/retalla-params.entity';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ERROR_DEFS } from '@/shared/components/form/error-def';
import { Router } from '@angular/router';
import { PermissionDirective } from '@/core/directives';

@Component({
  selector: 'svi-retalla-dump',
  imports: [CommonModule, ReactiveFormsModule, SmartScanInputComponent, ButtonComponent, FloatInputComponent, PermissionDirective],
  templateUrl: './retalla-dump.component.html',
  styleUrl: './retalla-dump.component.scss'
})
export class RetallaDumpComponent {
  form!: FormGroup;
  MAX_WEIGHT_GRAMS = 40000;
  router = inject(Router);
  readonly path = this.router.url;
  onCreateRetalla = output<IRetallaParamsEntity>();

  weightErrorMessages = ERROR_DEFS['weight'];

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = new FormGroup({
      sampleCode: new FormControl('', [Validators.required]),
      retainedWeight: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(this.MAX_WEIGHT_GRAMS)
      ]),
      passWeight: new FormControl('', [Validators.required, Validators.min(0), Validators.max(this.MAX_WEIGHT_GRAMS)])
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const retallaParams = this.generateRetallaParams(this.form.value);
    this.onCreateRetalla.emit(retallaParams);
    this.form.reset();
    this.form.markAsPristine();
  }

  generateRetallaParams(formData: any): IRetallaParamsEntity {
    const { sampleCode, retainedWeight, passWeight } = formData;
    return {
      sampleCode: sampleCode,
      retainedWeight: Number(retainedWeight),
      passWeight: Number(passWeight)
    };
  }
}
