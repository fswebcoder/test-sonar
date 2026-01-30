import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[uppercase]',
  standalone: true
})
export class UppercaseDirective {
  private readonly el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);


  @HostListener('input', ['$event'])
  onInput(): void {
    const element = this.el.nativeElement;
    const cursorPosition = element.selectionStart || 0;
    const currentValue = element.value;
    
    const upperCaseValue = currentValue.toUpperCase();
    
    if (currentValue !== upperCaseValue) {
      element.value = upperCaseValue;
      
      element.setSelectionRange(cursorPosition, cursorPosition);
    }
  }


  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {

    setTimeout(() => {
      this.onInput();
    }, 0);
  }


  @HostListener('blur')
  onBlur(): void {
    const element = this.el.nativeElement;
    const currentValue = element.value;
    const upperCaseValue = currentValue.toUpperCase();
    
    if (currentValue !== upperCaseValue) {
      element.value = upperCaseValue;
    }
  }
} 