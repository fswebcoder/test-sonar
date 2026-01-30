import { Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { Subject } from 'rxjs';
import { ToastCustomService } from '@SV-Development/utilities';
import { IMassiveSamplesBasePayload } from '@/domain/entities/lims/receptions/samples/massive-samples-base-payload.entity';
import { InputNumberComponent } from "@/shared/components/form/input-number/input-number.component";

@Component({
  selector: 'svi-add-massive-samples',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatInputComponent,
    FloatSelectComponent,
    CommonModule,
    ButtonComponent,
    CheckboxComponent,
    InputNumberComponent
],
  templateUrl: './add-massive-samples.component.html',
  styleUrl: './add-massive-samples.component.scss'
})
export class AddMassiveSamplesComponent implements OnDestroy {
  readonly MAX_SAMPLES = 100;
  form!: FormGroup;

  samplesTypes = input<ISampleType[]>([]);
  resetForm = input<boolean>(false);
  showMoistureField = input<boolean>(true);

  private destroy$ = new Subject<void>();

  emitMassiveSamples = output<IMassiveSamplesBasePayload>();
  cancel = output<void>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastCustomService);

  samplesCount = signal<number>(0);

  ngOnInit(): void {
    this.createForm();
    this.setupRangeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm() {
    this.form = this.fb.group({
      sampleType: new FormControl(null, [Validators.required]),
      prefix: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      rangeStart: new FormControl(null, [Validators.required, Validators.min(0)]),
      rangeEnd: new FormControl(null, [Validators.required, Validators.min(0)]),
    });

    if (this.showMoistureField()) {
      this.form.addControl('moistureDetermination', new FormControl(true));
    }
  }

  private setupRangeListener(): void {
    this.form.get('rangeStart')?.valueChanges.subscribe(() => this.calculateSamplesCount());
    this.form.get('rangeEnd')?.valueChanges.subscribe(() => this.calculateSamplesCount());
  }

  private calculateSamplesCount(): void {
    const start = this.form.get('rangeStart')?.value;
    const end = this.form.get('rangeEnd')?.value;

    if (start === null || end === null || start === undefined || end === undefined) {
      this.samplesCount.set(0);
      return;
    }

    if (end < start) {
      this.samplesCount.set(0);
      return;
    }

    const count = end - start + 1;
    this.samplesCount.set(count);

    if (count > this.MAX_SAMPLES) {
      this.form.get('rangeEnd')?.setErrors({ max: true });
    }
  }

  validateForm() {
    const start = this.form.get('rangeStart')?.value;
    const end = this.form.get('rangeEnd')?.value;

    if (end < start) {
      this.toastService.error(
        'Rango inválido',
        'El número final debe ser mayor o igual al número inicial'
      );
      return;
    }

    const count = end - start + 1;
    if (count > this.MAX_SAMPLES) {
      this.toastService.error(
        'Límite excedido',
        `Solo puede generar hasta ${this.MAX_SAMPLES} muestras a la vez. Actualmente: ${count}`
      );
      return;
    }

    if (this.form.valid) {
      const sampleTypeValue = this.form.get('sampleType')?.value;
      const sampleTypeId = typeof sampleTypeValue === 'string' ? sampleTypeValue : sampleTypeValue?.id;

      const payload: IMassiveSamplesBasePayload = {
        sampleTypeId: sampleTypeId,
        prefix: this.form.get('prefix')?.value.trim(),
        rangeStart: start,
        rangeEnd: end
      };

      if (this.showMoistureField()) {
        payload.moistureDetermination = !!this.form.get('moistureDetermination')?.value;
      }

      this.emitMassiveSamples.emit(payload);
    }
  }

  resetFormCompletely(): void {
    const resetValue: any = {};
    
    if (this.showMoistureField()) {
      resetValue.moistureDetermination = true;
    }

    this.form.reset(resetValue);
    this.samplesCount.set(0);
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  onCancel() {
    this.resetFormCompletely();
    this.cancel.emit();
  }
}
