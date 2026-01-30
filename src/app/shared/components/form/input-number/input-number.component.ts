import { FormErrorDirective } from '@/shared/directives/form-error.directive';
import { Component, Input, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'svi-input-number',
  standalone: true,
  imports: [InputNumberModule, ReactiveFormsModule, FormsModule, FloatLabelModule, FormErrorDirective],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent implements ControlValueAccessor {

  @Input() step: number = 1;
  @Input() min: number = 0;
  @Input() max: number | null = null;
  @Input() showButtons: boolean = true;
  @Input() inputStyle: any = {};
  @Input() buttonLayout: 'horizontal' | 'vertical' | 'stacked' = 'stacked';
  @Input() disabled: boolean = false;
  @Input() decimal: boolean = false;
  @Input() decimalPlaces: number = 0;
  
  errorMessages = input<Record<string, string>>({});
  label = input<string>('');
  
  value: number | null = null;


  private controlDir = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.controlDir != null) {
      this.controlDir.valueAccessor = this;
    }
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleValueChange(event: any) {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
  }
  get control(): FormControl<any> | null {
    return this.controlDir?.control as FormControl<any> | null;
  }


  get hasErrors(): boolean {
    return !!this.control && this.control.touched && this.control.invalid;
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (errors) {
      for (const type in errors) {
        if (this.errorMessages()[type]) {
          return this.errorMessages()[type];
        }
      }
      return `El campo ${this.label()?.toLowerCase()} es requerido`;
    }
    return '';
  }

}
