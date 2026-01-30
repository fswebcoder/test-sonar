import { FormErrorDirective } from '@/shared/directives/form-error.directive';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'svi-date-piker',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule, FloatLabelModule, IconFieldModule, FormErrorDirective],
  templateUrl: './date-piker.component.html'
})
export class DatePikerComponent implements ControlValueAccessor, OnInit {
  value: Date | null = null;
  id: string = '';

  constructor(@Optional() @Self() private controlDir: NgControl) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() errorMessages: Record<string, string> = {};
  @Input() inputErrors: any;
  @Input() touched?: boolean;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() showTime: boolean = false;
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() placeholder: string = '';
  @Input() showIcon: boolean = true;
  @Input() showButtonBar: boolean = false;
  @Input() showClear: boolean = false;
  @Input() readonlyInput: boolean = false;
  @Input() monthNavigator: boolean = false;
  @Input() yearNavigator: boolean = false;
  @Input() showOtherMonths: boolean = true;
  @Input() selectOtherMonths: boolean = false;
  @Input() appendTo: string = 'body';
  @Input() touchUI: boolean = false;
  @Input() showOnFocus: boolean = true;
  @Input() showWeek: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() numberOfMonths: number = 1;

  @Output() onSelect = new EventEmitter<Date>();
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onClear = new EventEmitter<any>();
  @Output() onMonthChange = new EventEmitter<any>();
  @Output() onYearChange = new EventEmitter<any>();
  @Output() onViewDateChange = new EventEmitter<any>();

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj !== undefined ? obj : null;
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

  onDateChange(event: any): void {
    if (event instanceof Date || event === null) {
      this.value = event;
      this.onChange(event);
      this.onTouched();
      this.onSelect.emit(event);
    }
  }

  onInputBlur(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  onInputFocus(event: Event): void {
    this.onFocus.emit(event);
  }

  onClearClick(): void {
    this.value = null;
    this.onChange(null);
    this.onTouched();
    this.onClear.emit();
  }

  onMonthChangeEvent(event: any): void {
    this.onMonthChange.emit(event);
  }

  onYearChangeEvent(event: any): void {
    this.onYearChange.emit(event);
  }

  onViewDateChangeEvent(event: any): void {
    this.onViewDateChange.emit(event);
  }

  ngOnInit(): void {
    this.id = 'date-piker-' + Math.random().toString(36).substr(2, 9);
  }


  get control(): FormControl<any> {
    return this.controlDir?.control as FormControl<any>;
  }

  get hasErrors(): boolean {
    return !!(this.control && this.control.touched && this.control.invalid);
  }

  get isFieldRequired(): boolean {
    return !!(this.control && this.control.hasValidator(Validators.required));
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
