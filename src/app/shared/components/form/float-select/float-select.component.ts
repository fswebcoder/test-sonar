import { FormErrorDirective } from '@/shared/directives/form-error.directive';
import { CommonModule } from '@angular/common';
import { Component, input, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, FormControl, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'svi-float-select',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, SelectModule, FormsModule, FormErrorDirective],
  templateUrl: './float-select.component.html',
  styleUrl: './float-select.component.scss',
  host: {
    class: 'w-full'
  }
})
export class FloatSelectComponent implements ControlValueAccessor {
  readonly id = `float-select-${crypto.randomUUID()}`;

  value: any = null;
  disabled = false;

  private controlDir = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.controlDir != null) {
      this.controlDir.valueAccessor = this;
    }
  }

  label = input<string>('');
  options = input<any[]>([]);
  optionLabel = input<string>('label');
  optionValue = input<string | undefined>(undefined);
  showClear = input<boolean>(false);
  filter = input<boolean>(false);
  filterBy = input<string>('label');
  emptyFilterMessage = input<string>('No se encontraron resultados');
  emptyMessage = input<string>('No hay opciones disponibles');
  errorMessages = input<Record<string, string>>({});
  loading = input<boolean>(false);
  disabledInput = input<boolean>(false);
  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value === '' ? null : value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('FloatSelect setDisabledState llamado con:', isDisabled);
    this.disabled = isDisabled;
  }

  onBlur() {
    this.onTouched();
  }

  handleChange(event: any): void {
    this.value = event.value;

    if (this.value === '' || this.value === undefined) {
      this.onChange(null);
    } else {
      this.onChange(this.value);
    }
  }

  get control(): FormControl<any> | null {
    return this.controlDir?.control as FormControl<any> | null;
  }

  get hasErrors(): boolean {
    return !!this.control && this.control.touched && this.control.invalid;
  }

  get required(): boolean {
    return !!this.control && this.control.hasValidator(Validators.required);
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
