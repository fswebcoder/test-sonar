import { FormErrorDirective } from '@/shared/directives/form-error.directive';
import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'svi-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, FloatLabelModule, FormErrorDirective],
  templateUrl: './multiselect.component.html'
})
export class FloatMultiselectComponent implements ControlValueAccessor {
  value: any[] = [];
  id: string = '';

  constructor(@Optional() @Self() private controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() disabled: boolean = false;
  @Input() errorMessages: Record<string, string> = {};
  @Input() placeholder: string = '';
  @Input() filter: boolean = true;
  @Input() showClear: boolean = true;
  @Input() maxSelectedLabels: number = 3;
  @Input() filterBy: string = '';
  @Input() selectedItemsLabel: string = '{0} elementos seleccionados';
  @Input() resetFilterOnHide: boolean = true;

  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj !== undefined ? obj : [];
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

  onSelectionChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  ngOnInit(): void {
    this.id = 'multiselect-' + Math.random().toString(36).substr(2, 9);
  }

  get control(): FormControl<any> {
    return this.controlDir?.control as FormControl<any>;
  }

  get hasErrors(): boolean {
    return this.control && this.control.touched && this.control.invalid;
  }

  get required(): boolean {
    return this.control && this.control.hasValidator(Validators.required);
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (errors) {
      for (const type in errors) {
        if (this.errorMessages[type]) {
          return this.errorMessages[type];
        }
      }
      return `El campo ${this.label.toLocaleLowerCase()} es requerido`;
    }
    return '';
  }

  onClear(): void {
    this.value = [];
    this.onChange(this.value);
    this.onTouched();
  }

  reset(): void {
    this.value = [];
    this.onChange(this.value);
    this.onTouched();
  }
}
