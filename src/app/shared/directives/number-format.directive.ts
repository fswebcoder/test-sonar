import { Directive, ElementRef, HostListener, model, OnInit, output } from '@angular/core';

@Directive({
  selector: '[sviNumberFormat]',
  standalone: true
})
export class NumberFormatDirective  {
  value = model<number | null>(null);

  valueChange = output<number | null>();

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (!value) {
      this.value.set(null);
      this.valueChange.emit(null);
      input.value = '';
      return;
    }

    let numericValue: number;
    if (value.length === 1) {
      numericValue = parseFloat('0.0' + value);
    } else if (value.length === 2) {
      numericValue = parseFloat('0.' + value);
    } else {
      numericValue = parseFloat(value.slice(0, value.length - 2) + '.' + value.slice(-2));
    }

    this.value.set(numericValue);
    this.valueChange.emit(numericValue);

    input.value = this.formatExcelNumber(numericValue);
  }

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent): void {
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (this.value() !== null && this.value() !== undefined && !isNaN(this.value()!)) {
      input.value = this.formatExcelNumber(this.value()!);
    } else {
      input.value = '';
    }
  }


  private formatExcelNumber(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End'];
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }
    if (event.key.includes('Arrow')) {
      return;
    }
    if (/[0-9]/.test(event.key)) {
      return;
    }
    if (event.key === '.') {
      event.preventDefault();
      return;
    }
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
