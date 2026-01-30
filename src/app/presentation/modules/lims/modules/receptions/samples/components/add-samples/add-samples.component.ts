import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnChanges,
  OnDestroy,
  output,
  signal,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ISamplesItems } from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaxWeightInfoComponent } from '@/shared/components/max-weight-info/max-weight-info.component';
import { Subject } from 'rxjs';
import { SampleWeightComponent } from '@/shared/components/sample-weight/sample-weight.component';
import { getCurrentDateString } from '@core/utils/get-current-date-string';

@Component({
  selector: 'svi-add-samples',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FloatInputComponent,
    FloatSelectComponent,
	CommonModule,
    ButtonComponent,
    MaxWeightInfoComponent,
    CheckboxComponent,
    SampleWeightComponent
  ],
  templateUrl: './add-samples.component.html',
  styleUrl: './add-samples.component.scss'
})
export class AddSamplesComponent implements OnChanges, OnDestroy {
  readonly MAX_WEIGHT_GRAMS = 40000;
  form!: FormGroup;

  weight = input<number | null>(null);
  allowManualWeight = input<boolean>(false);
  isReadingWeight = input<boolean>(false);

  resetForm = input<boolean>(false);
  samplesTypes = input<ISampleType[]>([]);
  selectedProviderShortName = input.required<string>();

  shifts = signal<{ id: string; name: string }[]>([
    { id: '02', name: '02' },
    { id: '04', name: '04' },
    { id: '06', name: '06' },
    { id: '08', name: '08' },
    { id: '10', name: '10' },
    { id: '12', name: '12' },
    { id: '14', name: '14' },
    { id: '16', name: '16' },
    { id: '18', name: '18' },
    { id: '20', name: '20' },
    { id: '22', name: '22' },
    { id: '00', name: '00' }
  ]);

  mills = signal<{ id: string; name: string }[]>([
    { id: 'M1', name: 'Molino 1' },
    { id: 'M2', name: 'Molino 2' }
  ]);


  autogenerateCode = signal<boolean>(false);

  private destroy$ = new Subject<void>();

  emitSamples = output<ISamplesItems>();
  cancel = output<void>();
  readWeight = output<void>();
  private fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  weightControl!: FormControl<number | null>;

  ngOnInit(): void {
    this.createForm();
    this.setupSampleTypeChangeListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetForm'] && this.resetForm()) {
      this.resetFormCompletely();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm() {
    this.form = this.fb.group({
      shift: new FormControl(null),
      mill: new FormControl(null),
      code: new FormControl({ value: '', disabled: true }, [Validators.required]),
      sampleType: new FormControl(null, [Validators.required]),
      receivedWeight: new FormControl(null, [Validators.required, Validators.max(this.MAX_WEIGHT_GRAMS), Validators.min(0)]),
      autoGenerateCode: new FormControl(false),
      moistureDetermination: new FormControl(false, []),
    });

    this.weightControl = this.form.get('receivedWeight') as FormControl<number | null>;

    this.setupCodeGeneration();
 }

  private setupCodeGeneration(): void {
    const fieldsToWatch = ['shift', 'mill', 'sampleType'];

    fieldsToWatch.forEach(field => {
      this.form
        .get(field)
        ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          if (this.autogenerateCode()) {
            this.generateCodeInRealTime();
          }
        });
    });

    this.generateCodeInRealTime();
  }

  private setupSampleTypeChangeListener(): void {
    this.form
      .get('sampleType')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        const emittedValue = typeof value === 'string' ? value : value?.id;
        if (!emittedValue) {
          this.autogenerateCode.set(false);
          return;
        }

        const selectedSampleType = this.samplesTypes().find(st => st.id.toString() === emittedValue.toString());
        this.autogenerateCode.set(!!selectedSampleType?.autoGenerateCode);
      });
  }

  private generateCodeInRealTime(): void {
    try {
      const providerShortName = this.selectedProviderShortName();

      const dateString = getCurrentDateString();

      const shift = this.form.get('shift')?.value;
      const mill = this.form.get('mill')?.value;
      const sampleType = this.form.get('sampleType')?.value;

      const sampleTypeShortName = sampleType ? this.getSampleTypeShortName(sampleType) : '';

      const shiftValue = shift ? (typeof shift === 'string' ? shift : shift?.id || shift) : '';

      const millValue = mill ? (typeof mill === 'string' ? mill : mill?.id || mill) : '';

      let generatedCode = providerShortName + dateString;

      if (sampleTypeShortName) {
        generatedCode += sampleTypeShortName;
      }

      if (shiftValue) {
        generatedCode += shiftValue;
      }

      if (millValue) {
        generatedCode += millValue;
      }

      this.form.get('code')?.setValue(generatedCode, { emitEvent: false });
    } catch (error) {
      console.error('Error generando código:', error);
      this.form.get('code')?.setValue('', { emitEvent: false });
    }
  }

  private getSampleTypeShortName(sampleType: any): string {
    if (!sampleType) {
      return '';
    }

    const sampleTypes = this.samplesTypes();
    const sampleTypeId = typeof sampleType === 'string' ? sampleType : sampleType?.id;

    if (!sampleTypeId) {
      return '';
    }

    const found = sampleTypes.find(s => s.id.toString() === sampleTypeId.toString());
    return found?.shortName || '';
  }

  getShiftName(id: number | string | null | undefined): string {
    if (!id) return '';

    const found = this.shifts().find(s => s.id.toString() === id.toString());
    return found ? found.name : id.toString();
  }

  getMillName(id: number | string | null | undefined): string {
    if (!id) return '';

    const found = this.mills().find(m => m.id.toString() === id.toString());
    return found ? found.name : id.toString();
  }

  getSampleTypeName(id: number | string | null | undefined): string {
    if (!id) return '';

    const found = this.samplesTypes()?.find(s => s.id.toString() === id.toString());
    return found ? found.name : id.toString();
  }

  codeGenerationEffect$ = effect(() => {
    const providerShortName = this.selectedProviderShortName();
    if (providerShortName && this.form && this.autogenerateCode()) {
      this.generateCodeInRealTime();
    }
  });

  validateForm() {
    if (this.form.valid) {
      const data = this.generateSamplesPayload();
      this.emitSamples.emit(data);
    }
    return false;
  }

  generateSamplesPayload(): ISamplesItems {
    const sampleTypeValue = this.form.get('sampleType')?.value;
    const sampleTypeId = typeof sampleTypeValue === 'string' ? sampleTypeValue : sampleTypeValue?.id;
    return {
      sampleTypeId: sampleTypeId,
      code: this.form.get('code')?.value,
      receivedWeight: this.form.get('receivedWeight')?.value ?? 0,
      moistureDetermination: !!this.form.get('moistureDetermination')?.value,
    };
  }


  codeDisableEffect$ = effect(() => {
    if (!this.form) return;

    const auto = this.autogenerateCode();
    const codeControl = this.form.get('code');

    if (!codeControl) return;

    if (auto && codeControl.enabled) {
      codeControl.disable({ emitEvent: false });
      this.generateCodeInRealTime();
    } else if (!auto && codeControl.disabled) {
      this.form.get('code')?.setValue('', { emitEvent: false });
      codeControl.enable({ emitEvent: false });
    }
  });

  requiredControlsEffect$ = effect(() => {
    if (!this.form) return;

    const auto = this.autogenerateCode();

    const shiftControl = this.form.get('shift');
    const millControl = this.form.get('mill');

    if (!shiftControl || !millControl) return;

    if (auto) {
      shiftControl.setValidators([Validators.required]);
      millControl.setValidators([Validators.required]);
    } else {
      shiftControl.clearValidators();
      millControl.clearValidators();
    }

    shiftControl.updateValueAndValidity({ emitEvent: false });
    millControl.updateValueAndValidity({ emitEvent: false });
  });

  weightSyncEffect$ = effect(() => {
    if (!this.form || !this.weightControl) return;
    const externalWeight = this.weight();
    const current = this.weightControl.value;
    if (externalWeight === current) return;
    this.weightControl.setValue(externalWeight, { emitEvent: false });
  });

  resetFormCompletely(): void {
    this.form.reset({
      autoGenerateCode: false,
      moistureDetermination: true,
    });
    this.autogenerateCode.set(false);
    this.weightControl.reset();
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  get isFormValid(){
    return this.form.valid && this.weightControl.valid;
  }


  onCancel() {
    this.resetFormCompletely();
    this.cancel.emit();
  }

  handleReadWeight(): void {
    this.readWeight.emit();
  }

}
