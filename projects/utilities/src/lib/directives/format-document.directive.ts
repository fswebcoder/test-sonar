import { Directive, ElementRef, HostListener, inject, signal, effect, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sviCedulaFormat]',
  standalone: true
})
export class CedulaFormatDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private ngControl = inject(NgControl, { optional: true });
  
  private displayValue = signal<string>('');
  private actualValue = signal<string>('');
  
  constructor() {
    effect(() => {
      if (this.ngControl?.control?.value !== undefined) {
        const controlValue = this.ngControl.control.value || '';
        const cleanValue = this.cleanValue(controlValue.toString());
        this.updateValues(cleanValue);
      }
    });
  }

  ngOnInit(): void {
    if (this.ngControl?.control?.value) {
      const controlValue = this.ngControl.control.value || '';
      const cleanValue = this.cleanValue(controlValue.toString());
      this.updateValues(cleanValue);
    }
    
    setInterval(() => {
      const input = this.elementRef.nativeElement as HTMLInputElement;
      if (input && input === document.activeElement) {
        const rawValue = this.cleanValue(input.value);
        if (rawValue && /^\d+$/.test(rawValue) && rawValue !== this.actualValue()) {
          this.updateValues(rawValue);
          input.value = this.displayValue();
        }
      }
    }, 500);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = this.cleanValue(input.value);
    if (!/^\d*$/.test(rawValue) || rawValue.length > 10) {
      input.value = this.displayValue();
      return;
    }

    this.updateValues(rawValue);
    this.updateFormControl(rawValue);
    
    setTimeout(() => {
      const currentValue = this.cleanValue(input.value);
      if (currentValue !== rawValue) {
        this.updateValues(rawValue);
        input.value = this.displayValue();
        const cursorPosition = this.displayValue().length;
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 50);
    
    setTimeout(() => {
      const finalValue = this.cleanValue(input.value);
      if (finalValue && finalValue !== this.actualValue()) {
        this.updateValues(finalValue);
        input.value = this.displayValue();
        const cursorPosition = this.displayValue().length;
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 200);
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = this.cleanValue(input.value);

    if (rawValue && /^\d+$/.test(rawValue)) {
      this.updateValues(rawValue);
      input.value = this.displayValue();
    } else {
      input.value = this.displayValue();
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = this.cleanValue(input.value);
    if (rawValue && /^\d+$/.test(rawValue)) {
      this.updateValues(rawValue);
      this.updateFormControl(rawValue);
      input.value = this.displayValue();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const cleanText = this.cleanValue(pastedText);
    
    if (/^\d{1,10}$/.test(cleanText)) {
      this.updateValues(cleanText);
      this.updateFormControl(cleanText);
    }
  }

  @HostListener('change', ['$event'])
  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = this.cleanValue(input.value);
      
    if (rawValue !== this.actualValue()) {
      this.updateValues(rawValue);
      this.updateFormControl(rawValue);
    }
    
    if (rawValue && /^\d+$/.test(rawValue)) {
      setTimeout(() => {
        this.updateValues(rawValue);
        input.value = this.displayValue();
        const cursorPosition = this.displayValue().length;
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 100);
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = this.cleanValue(input.value);
    if (rawValue !== this.actualValue() && /^\d+$/.test(rawValue)) {
      this.updateValues(rawValue);
      this.updateFormControl(rawValue);
      setTimeout(() => {
        const currentValue = this.cleanValue(input.value);
        if (currentValue !== rawValue) {
          this.updateValues(rawValue);
          input.value = this.displayValue();
          const cursorPosition = this.displayValue().length;
          input.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 50);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /^[0-9]$/.test(event.key);
    const isControlKey = allowedKeys.includes(event.key);
    const isCtrlKey = event.ctrlKey || event.metaKey;
    
    if (!isNumber && !isControlKey && !isCtrlKey) {
      event.preventDefault();
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (/^[0-9]$/.test(event.key)) {
      setTimeout(() => {
        const input = event.target as HTMLInputElement;
        const rawValue = this.cleanValue(input.value);
        if (rawValue && /^\d+$/.test(rawValue)) {
          this.updateValues(rawValue);
          this.updateFormControl(rawValue);
        }
      }, 10);
    }
  }

  private cleanValue(value: string): string {
    return value.replace(/\D/g, '');
  }
  
  private formatCedula(value: string): string {
    if (!value) return '';

    const addThousandSeparators = (num: string): string => {
      const parts = [];
      let remaining = num;
      
      while (remaining.length > 3) {
        parts.unshift(remaining.slice(-3));
        remaining = remaining.slice(0, -3);
      }
      
      if (remaining.length > 0) {
        parts.unshift(remaining);
      }
      
      return parts.join('.');
    };
    
    const formatted = addThousandSeparators(value);
    return formatted;
  }

  private updateValues(rawValue: string): void {
    this.actualValue.set(rawValue);
    const formattedValue = this.formatCedula(rawValue);
    this.displayValue.set(formattedValue);
    
    const input = this.elementRef.nativeElement as HTMLInputElement;
    if (input) {
      input.value = formattedValue;
      
      const cursorPosition = formattedValue.length;
      input.setSelectionRange(cursorPosition, cursorPosition);
    } 
  }

  private updateFormControl(value: string): void {
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(value, { emitEvent: false });
    }
  }
}
