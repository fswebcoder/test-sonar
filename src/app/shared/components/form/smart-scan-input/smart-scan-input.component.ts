import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, computed, forwardRef, input, output, signal, viewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, debounceTime, filter } from 'rxjs';

@Component({
  selector: 'svi-smart-scan-input',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmartScanInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SmartScanInputComponent),
      multi: true
    }
  ],
  templateUrl: './smart-scan-input.component.html',
  styleUrl: './smart-scan-input.component.scss'
})
export class SmartScanInputComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly _value = new BehaviorSubject<string | null>(null);

  outputTransformFn = input<(v: string | null) => any>((value: string | null) =>
    value?.replaceAll("'", '-').replaceAll('/', '-') ?? null
  );

  debounceTime = input<number>(50);
  value = signal<string | null>(null);
  onValueChange = output<string>();
  inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');

  isDisabled = signal(false);
  isScanning = signal(false);

  value$ = this._value.asObservable();
  valueChange = output<string>();
  scanAreaClasses = computed(() => {
    const value = this.value();
    const isScanning = this.isScanning();
    const isDisabled = this.isDisabled();

    return {
      'border-gray-300 bg-gray-50 cursor-pointer': !value && !isScanning,
      'border-primary bg-primary/5 pulse-animation !cursor-initial': !value && isScanning,
      'border-green-500 bg-green-50 !cursor-default': value,
      'opacity-60 !cursor-not-allowed': isDisabled
    };
  });

  ngOnInit(): void {
    setTimeout(() => {
      this.focusInput();
    }, 100);

    this.value$
      .pipe(
        filter(v => !!v),
        debounceTime(this.debounceTime())
      )
      .subscribe(value => {
        this.value.set(value);

        this.inputRef().nativeElement.blur();
      });
  }

  onInputFocus(): void {
    this.isScanning.set(true);
  }

  onInputBlur(): void {
    this.isScanning.set(false);
  }

  focusInput(): void {
    this.inputRef().nativeElement.focus();
  }

  updateValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const rawValue = inputElement.value;
    const transformedValue = this.outputTransformFn()(rawValue);

    if (typeof transformedValue === 'string') {
      inputElement.value = transformedValue;
    } else if (transformedValue == null) {
      inputElement.value = '';
    }

    this._value.next(transformedValue);
    this.valueChange.emit(transformedValue);
  }

  rescan(): void {
    this._value.next(null);
    this.value.set(null);
    setTimeout(() => this.focusInput(), 50);
  }

  writeValue(obj: any): void {
    const value = obj?.value ?? obj;
    this._value.next(value);
    this.value.set(value);
  }
  registerOnChange(fn: any): void {
    this.value$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }
}
