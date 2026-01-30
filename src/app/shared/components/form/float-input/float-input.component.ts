import { FormErrorDirective } from '@/shared/directives/form-error.directive';
import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, computed, input, signal, OnInit, OnDestroy, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { InputTransformFn, NgxMaskDirective, OutputTransformFn } from 'ngx-mask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'svi-float-input',
  standalone: true,
  imports: [
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    PasswordModule,
    FormErrorDirective
  ],
  templateUrl: './float-input.component.html'
})
export class FloatInputComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  readonly id = `float-input-${crypto.randomUUID()}`;

  control = new FormControl('');
  onTouchedFn = () => {};
  onChangeFn = (_: any) => {};
  private _isDisabled = false;
  private destroy$ = new Subject<void>();
  private _isWritingValue = false;
  private controlDir = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.controlDir != null) {
      this.controlDir.valueAccessor = this;
    }
  }

  icon = input<string>();
  label = input<string>();
  mask = input<string | null>(null);
  suffix = input<string>('');
  prefix = input<string>('');
  allowNegativeNumbers = input<boolean, any>(false, { transform: booleanAttribute });
  thousandSeparator = input<string>('.');
  decimalMarker = input<',' | '.' | ['.', ',']>(',');
  type = input<'text' | 'password' | 'number' | 'email'>('text');
  isWeightInput = input<boolean>(false, { alias: 'isWeightInput' });
  weightDecimals = input<number>(2);

  customOutputTransformFn = input<OutputTransformFn>((val: any) => val, { alias: 'outputTransformFn' });
  inputTransformFn = input<InputTransformFn>((val: any) => val);

  errorMessages = input<Record<string, string>>({});
  uppercase = input<boolean>(false);
  disabled = input<boolean, any>(false, { transform: booleanAttribute });
  isDisabled = computed(() => this._isDisabled || this.disabled());

  weightOptions = computed<{
    mask: string;
    thousandSeparator: string;
    decimalMarker: ',' | '.' | ['.', ','];
    type: 'text' | 'email' | 'password' | 'number';
    allowNegativeNumbers: boolean;
    suffix: string;
    prefix: string;
    errorMessages?: Record<string, string>;
  }>(() => ({
    mask: `separator.${Math.max(0, Math.min(this.weightDecimals() ?? 2, 6))}`,
    thousandSeparator: '.',
    decimalMarker: ',',
    type: 'text',
    allowNegativeNumbers: false,
  suffix: this.suffix() ? ' ' + this.suffix() : '',
    prefix: ''
  }));

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!this._isWritingValue) {
        this.onChangeFn(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(obj: any): void {
    if (this.control && !this._isWritingValue) {
      this._isWritingValue = true;
      this.control.setValue(obj, { emitEvent: false });
      this._isWritingValue = false;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  validate(control: FormControl): ValidationErrors | null {
    return control.touched && control.invalid ? control.errors : null;
  }

  get hasErrors(): boolean {
    const parent = this.controlDir?.control as FormControl | null;
    return (parent?.touched && parent?.invalid) ?? false;
  }

  private defaultErrorMessages: Record<string, (label: string, error?: any) => string> = {
    required: label => `El campo ${label} es requerido`,
    minlength: (label, error) => `El campo ${label} debe tener al menos ${error?.requiredLength} caracteres`,
    maxlength: (label, error) => `El campo ${label} no puede superar los ${error?.requiredLength} caracteres`,
    email: label => `El campo ${label} debe ser un correo válido`,
    pattern: label => `El campo ${label} no cumple con el formato esperado`
  };

  get errorMessage(): string {
    const parent = this.controlDir?.control as FormControl | null;
    const errors = parent?.errors;
    const customMessages = this.errorMessages();
    const label = this.label() ?? 'este campo';

    if (errors) {
      for (const type in errors) {
        if (customMessages[type]) {
          return customMessages[type];
        }

        if (this.defaultErrorMessages[type]) {
          return this.defaultErrorMessages[type](label.toLowerCase(), errors[type]);
        }
      }
      return `El campo ${label.toLowerCase()} es inválido`;
    }
    return '';
  }

  outputTransformFn = computed<OutputTransformFn>(() => {
    const type = this.type();
    const isWeightInput = this.isWeightInput();
    const customFn: OutputTransformFn = this.customOutputTransformFn();
    return (value: string | number | undefined | null) => {
      if (isWeightInput) {
        return this.extractWeightValue(value);
      }
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

  private extractWeightValue(value: string | number | undefined | null): number | null {
    if (value === null || value === undefined) return null;

    const maxDecimals = Math.max(0, Math.min(this.weightDecimals() ?? 0, 6));

    if (typeof value === 'number') {
      return Number(value.toFixed(maxDecimals));
    }

    if (typeof value === 'string') {
      const cleanValue = value.replace(/[^\d.-]/g, '');

      if (cleanValue === '') return null;

      const numericValue = parseFloat(cleanValue);
      if (isNaN(numericValue)) return null;

      return Number(numericValue.toFixed(maxDecimals));
    }

    return null;
  }

  onBlur(): void {
    this.onTouchedFn();
    this.control.markAsTouched({ onlySelf: true });
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;

    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }
}
