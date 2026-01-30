import {
  Component,
  forwardRef,
  input,
  output,
  ContentChild,
  AfterContentInit,
  ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svi-checkbox',
  standalone: true,
  imports: [CommonModule, CheckboxModule, FormsModule],
  template: `
    <div class="flex gap-2 align-items-center ">
      <p-checkbox
        [inputId]="inputId()"
        [value]="value()"
        [binary]="binary()"
        [disabled]="disabled() || isDisabled"
        [readonly]="readonly()"
        [required]="required()"
        [trueValue]="trueValue()"
        [falseValue]="falseValue()"
        [tabindex]="tabindex()"
        [ariaLabel]="ariaLabel()"
        [ariaLabelledBy]="ariaLabelledBy()"
        [name]="name() || ''"
        [styleClass]="styleClass()"
        [style]="style()"
        [autofocus]="autofocus()"
        [(ngModel)]="internalValue"
        (ngModelChange)="onModelChange($event)"
        (onChange)="onChangeEvent($event)"
        (onFocus)="onFocusEvent($event)"
        (onBlur)="onBlurEvent($event)"
      >
      </p-checkbox>
      <label
        class="p-checkbox-label"
        *ngIf="label() || hasProjectedContent"
        [for]="inputId()"
      >
        {{ label() }}
        <ng-content></ng-content>
      </label>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor, AfterContentInit {
  inputId = input<string>();
  value = input<any>();
  label = input<string>();
  binary = input<boolean>(true);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  trueValue = input<any>(true);
  falseValue = input<any>(false);
  tabindex = input<number>();
  ariaLabel = input<string>();
  ariaLabelledBy = input<string>();
  name = input<string>();
  styleClass = input<string>();
  style = input<any>();
  labelStyleClass = input<string>();
  formControlName = input<string>();
  autofocus = input<boolean>(false);
  variant = input<'filled' | 'outlined'>('outlined');

  onChange = output<any>();
  onFocus = output<Event>();
  onBlur = output<Event>();

  internalValue: any = false;
  hasProjectedContent = false;
  isDisabled = false;

  @ContentChild('projected', { read: ElementRef }) projectedContent?: ElementRef;

  ngAfterContentInit(): void {
    this.hasProjectedContent = !!this.projectedContent;
  }

  private onTouched = () => {};
  private onChanged = (value: any) => {};

  writeValue(value: any): void {
    this.internalValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onModelChange(value: any): void {
    this.internalValue = value;
    this.onChanged(value);
    this.onTouched();
  }

  onChangeEvent(event: any): void {
    this.onChange.emit(event);
  }

  onFocusEvent(event: Event): void {
    this.onFocus.emit(event);
  }

  onBlurEvent(event: Event): void {
    this.onBlur.emit(event);
    this.onTouched();
  }
}
