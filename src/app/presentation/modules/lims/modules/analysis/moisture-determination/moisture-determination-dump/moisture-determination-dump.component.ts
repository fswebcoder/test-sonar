import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { Component, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ICreateMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/create-moisture-determination-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { PermissionDirective } from '@/core/directives';
import { Router } from '@angular/router';
import { ISampleMoistureDeterminationResponseEntity } from '@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-response.entity';
import { CommonModule } from '@angular/common';
import { IUpdateMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/update-moisture-determination-params.entity';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ERROR_DEFS } from '@/shared/components/form/error-def';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'svi-moisture-determination-dump',
  imports: [
    ReactiveFormsModule,
    SmartScanInputComponent,
    ButtonComponent,
    PermissionDirective,
    CommonModule,
    FloatInputComponent
  ],
  templateUrl: './moisture-determination-dump.component.html',
  styleUrl: './moisture-determination-dump.component.scss'
})
export class MoistureDeterminationDumpComponent {
  selectedSample = input.required<ISampleMoistureDeterminationResponseEntity | null>();

  formBuilder = inject(FormBuilder);
  router = inject(Router);

  form!: FormGroup;

  onSaveMoistureDetermination = output<ICreateMoistureDeterminationParamsEntity>();
  onChangeSampleCode = output<string>();
  onUpdateMoistureDetermination = output<IUpdateMoistureDeterminationParamsEntity>();
  onResetSample = output<void>();
  path = this.router.url;

  weightErrorMessages = ERROR_DEFS['weight'];
  dryWeightErrorMessages = {
    ...ERROR_DEFS['weight'],
    dryWeightExceedsWet: 'El peso seco no puede ser mayor que el peso húmedo'
  };

  constructor() {
    effect(() => {
      const sample = this.selectedSample();
      this.onSampleChange(sample);
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.listenSampleCode();
  }

  createForm() {
    this.form = this.formBuilder.group({
      sampleCode: [null, [Validators.required]],
      dryWeight: [null, [Validators.max(40000), Validators.min(0)]],
      wetWeight: [null, [Validators.max(40000), Validators.min(0)]],
      tareWeight: [null, [Validators.max(40000), Validators.min(0)]],
      tareWeightReadonly: [{ value: null, disabled: true }],
      wetWeightReadonly: [{ value: null, disabled: true }]
    });
  }

  private onSampleChange(sample: ISampleMoistureDeterminationResponseEntity | null): void {
    if (sample?.data) {
      const { tareWeight, wetWeight } = sample.data.resultValue;
      this.form.patchValue({
        tareWeightReadonly: tareWeight.value,
        wetWeightReadonly: wetWeight.value
      });

      // Agregar validador dinámico para dryWeight
      const wetWeightValue = Number(wetWeight.value);
      this.form
        .get('dryWeight')
        ?.setValidators([
          Validators.max(40000),
          Validators.min(0),
          this.maxValueValidator(wetWeightValue, 'dryWeightExceedsWet')
        ]);
      this.form.get('dryWeight')?.updateValueAndValidity();
    }
  }

  private maxValueValidator(maxValue: number, errorKey: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== null && control.value !== undefined && Number(control.value) > maxValue) {
        return { [errorKey]: true };
      }
      return null;
    };
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  listenSampleCode() {
    this.form
      .get('sampleCode')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(value => {
        return value ? this.onChangeSampleCode.emit(value) : -1;
      });
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    const sample = this.selectedSample();

    if (this.shouldCreateNewMoistureDetermination(sample)) {
      this.createMoistureDetermination();
    } else if (this.shouldUpdateMoistureDetermination(sample)) {
      this.updateMoistureDetermination();
    }
  }

  private isFormValid(): boolean {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  private shouldCreateNewMoistureDetermination(sample: ISampleMoistureDeterminationResponseEntity | null): boolean {
    return !!(sample && sample.data === null && (this.form.value.wetWeight || this.form.value.tareWeight));
  }

  private shouldUpdateMoistureDetermination(sample: ISampleMoistureDeterminationResponseEntity | null): boolean {
    return !!(sample && sample.data && sample.data !== null && this.form.value.dryWeight);
  }

  private createMoistureDetermination(): void {
    this.onSaveMoistureDetermination.emit({
      wetWeight: Number(this.form.value.wetWeight),
      tareWeight: Number(this.form.value.tareWeight),
      sampleCode: this.form.value.sampleCode
    });
    this.resetAfterSubmit();
  }

  private updateMoistureDetermination(): void {
    this.onUpdateMoistureDetermination.emit({
      sampleCode: this.form.value.sampleCode,
      dryWeight: Number(this.form.value.dryWeight)
    });
    this.resetAfterSubmit();
  }

  private resetAfterSubmit() {
    this.resetForm();
    this.onResetSample.emit();
  }
}
