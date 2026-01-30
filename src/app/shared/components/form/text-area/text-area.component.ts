import { Component, forwardRef, Input, Optional, Self } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { FormErrorDirective } from '@/shared/directives/form-error.directive';

@Component({
  selector: 'svi-text-area',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, TextareaModule, FormErrorDirective],
  templateUrl: './text-area.component.html'
})
export class TextAreaComponent implements ControlValueAccessor {
  value: string = '';
  id: string = '';

  constructor(@Optional() @Self() private controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() rows: number = 1;
  @Input() cols: number = 30;
  @Input() errorMessages: Record<string, string> = {};
  @Input() inputErrors: any;
  @Input() touched?: boolean;
  @Input() maxLength?: number;
  @Input() showCharCount: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj !== undefined ? obj : '';
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

  onInputChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  ngOnInit(): void {
    this.id = 'text-area-' + Math.random().toString(36).substr(2, 9);
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
      return `El campo ${this.label.toLocaleLowerCase()} es inválido`;
    }
    return '';
  }

  get currentLength(): number {
    return this.value?.length || 0;
  }

  get charCountText(): string {
    if (!this.maxLength) return `${this.currentLength}`;
    return `${this.currentLength} de ${this.maxLength}`;
  }

  get charCountClass(): string {
    if (!this.maxLength) return '';
    const current = this.currentLength;
    if (current > this.maxLength) return 'text-danger';
    if (current === this.maxLength) return 'text-danger';
    if (current >= this.maxLength * 0.9) return 'text-warning';
    return 'text-muted';
  }
}
