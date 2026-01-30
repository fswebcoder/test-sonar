import { FormErrorDirective } from '@/shared/directives/form-error.directive';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  standalone: true,
  selector: 'svi-auto-complete',
  imports: [CommonModule, FormsModule, AutoCompleteModule, FloatLabelModule, FormErrorDirective],
  template: `
      <p-floatlabel class="w-full" variant="on">
        <p-autoComplete
          [suggestions]="suggestions"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          [placeholder]="placeholder"
          (completeMethod)="onComplete($event)"
          (onSelect)="onSelect.emit($event)"
          (onClear)="onClear.emit()"
          (onBlur)="handleBlur()"
          [forceSelection]="forceSelection"
          [minLength]="minLength"
          [dropdown]="dropdown"
          [disabled]="disabled"
          [optionLabel]="labelField"
          [optionValue]="valueField"
          [inputStyleClass]="inputStyleClass"
          class="w-full"
          [class.ng-invalid]="hasErrors"
          [class.ng-dirty]="hasErrors"
          styleClass="w-full"
        ></p-autoComplete>
        <label>{{ label }}</label>
      </p-floatlabel>

      <div sviFormError [errorMessage]="errorMessage" [show]="hasErrors"></div>

  `
  // 👇 SIN providers de NG_VALUE_ACCESSOR
})
export class AutoCompleteComponent implements ControlValueAccessor {

  constructor(@Optional() @Self() private controlDir: NgControl) {
    if (this.controlDir) {
      // patrón igual a tu DatePikerComponent
      this.controlDir.valueAccessor = this;
    }
  }

  @Input() suggestions: any[] = [];
  @Input() placeholder = '';
  @Input() forceSelection = false;
  @Input() minLength = 1;
  @Input() dropdown = false;
  @Input() disabled = false;

  /** PrimeNG 16/17+: usa estas props */
  @Input() labelField: string = 'label';
  @Input() valueField: string = 'value';

  @Input() inputStyleClass = 'w-full';

  @Input() label: string = '';
  @Input() errorMessages: Record<string, string> = {};

  @Output() valueChange = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<void>();
  @Output() completeMethod = new EventEmitter<any>();

  value: any = null;

  private onChange: (_: any) => void = () => { };
  private onTouched: () => void = () => { };

  // ---- ControlValueAccessor ----
  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  // --------------------------------

  onValueChange(val: any) {
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onComplete(event: any) {
    this.completeMethod.emit(event);
  }

  handleBlur() {
    this.onTouched();
  }

  // Helpers para errores (igual patrón que el DatePiker)
  get control(): FormControl<any> {
    return this.controlDir?.control as FormControl<any>;
  }

  get hasErrors(): boolean {
    return !!(this.control && this.control.touched && this.control.invalid);
  }

  get isFieldRequired(): boolean {
    return !!(this.control && this.control.hasValidator?.(Validators.required));
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (errors) {
      for (const type in errors) {
        if (this.errorMessages[type]) {
          return this.errorMessages[type];
        }
      }
      return `El campo ${this.label?.toLowerCase()} es requerido`;
    }
    return '';
  }
}
