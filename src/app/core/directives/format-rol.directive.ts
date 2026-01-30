import { Directive, ElementRef, HostListener, inject, signal } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sviFormatRol]'
})
export class FormatRolDirective {
  private elementRef = inject(ElementRef);
  private ngControl = inject(NgControl, { optional: true });
  
  private formattedValue = signal<string>('');

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;
    
    const formattedValue = this.formatText(originalValue);
    
    this.formattedValue.set(formattedValue);
    
    if (originalValue !== formattedValue) {
      const cursorPosition = input.selectionStart || 0;
      input.value = formattedValue;
      
      const newCursorPosition = this.calculateCursorPosition(
        originalValue, 
        formattedValue, 
        cursorPosition
      );
      
      input.setSelectionRange(newCursorPosition, newCursorPosition);
      
      if (this.ngControl?.control) {
        this.ngControl.control.setValue(formattedValue, { emitEvent: false });
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    
    const pastedText = event.clipboardData?.getData('text') || '';
    const input = this.elementRef.nativeElement as HTMLInputElement;
    
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    
    const newValue = currentValue.substring(0, selectionStart) + 
                    pastedText + 
                    currentValue.substring(selectionEnd);
    
    const formattedValue = this.formatText(newValue);
    
    input.value = formattedValue;
    this.formattedValue.set(formattedValue);
    
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(formattedValue);
    }
  }

  private formatText(value: string): string {
    if (!value) return '';
    
    return value
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '')
      .replace(/_+/g, '_');
  }

  private calculateCursorPosition(
    originalValue: string, 
    newValue: string, 
    originalPosition: number
  ): number {
    const ratio = originalPosition / (originalValue.length || 1);
    return Math.round(ratio * newValue.length);
  }

  public getFormattedValue(): string {
    return this.formattedValue();
  }

}


