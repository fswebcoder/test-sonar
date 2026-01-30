import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, computed, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { InputTransformFn, OutputTransformFn } from 'ngx-mask';
import { FloatInputComponent } from "../form/float-input/float-input.component";
import { EWeightUnits } from '@/shared/enums/weight-units.enum';

@Component({
  selector: 'svi-weight-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatInputComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeightInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WeightInputComponent),
      multi: true
    }
  ],
  templateUrl: './weight-input.component.html',
  host: {
    class: 'w-full'
  }
})
export class WeightInputComponent implements ControlValueAccessor, Validator {
  control = new FormControl('');
  parentControl: FormControl | null = null;
  onTouchedFn = () => {};
  onChangeFn = (_: any) => {};

  icon = input<string>();
  label = input<string>('Peso');
  unit = input<EWeightUnits>(EWeightUnits.GRAMS);
  allowNegativeNumbers = input<boolean, any>(false, { transform: booleanAttribute });
  
  mask = input<string>('separator.2');
  thousandSeparator = input<string>('.');
  decimalMarker = input<',' | '.' | ['.', ',']>(',');
  type = input<'text' | 'number'>('text');

  customOutputTransformFn = input<OutputTransformFn>((val: any) => val, { alias: 'outputTransformFn' });
  inputTransformFn = input<InputTransformFn>((val: any) => val);
  textRight = input<boolean>(false);

  errorMessages = input<Record<string, string>>({});

  suffix = computed(() => ` ${this.unit()}`);

  writeValue(obj: any): void {
    this.control.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    this.control.valueChanges.subscribe(value => {
      this.onChangeFn(value);
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  validate(control: FormControl): ValidationErrors | null {
    this.parentControl = control;
  
    control.statusChanges.subscribe(() => {
      if (this.control && control.errors) {
        this.control.setErrors(control.errors);
      }
    });
  
    if (!this.allowNegativeNumbers() && control.value !== null && control.value !== undefined) {
      const numValue = typeof control.value === 'string' ? parseFloat(control.value) : control.value;
      if (numValue < 0) {
        return { negativeNotAllowed: true };
      }
    }
  
    return null;
  }
  

  outputTransformFn = computed<OutputTransformFn>(() => {
    const type = this.type();
    const customFn: OutputTransformFn = this.customOutputTransformFn();

    return (value: string | number | undefined | null) => {
      switch (type) {
        case 'number':
          if (typeof value === 'number') return customFn(value);
          if (typeof value === 'string' && value !== '') return customFn(Number(value));
          return null;
        case 'text':
          if (typeof value === 'number') return customFn(String(value));
          if (typeof value === 'string' && value !== '') return customFn(value);
          return null;
        default:
          return customFn(value);
      }
    };
  });
} 