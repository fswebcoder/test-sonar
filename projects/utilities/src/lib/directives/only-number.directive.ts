import { Directive, ElementRef, HostListener, inject, input, OnInit, signal } from '@angular/core';

@Directive({
  selector: '[numericInput]',
  standalone: true
})
export class NumericInputDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLInputElement>);

  public value = signal<string>('');

  allowDecimals = input<boolean>(false);

  allowNegatives = input<boolean>(false);

  ngOnInit() {
    this.el.nativeElement.style.textAlign = 'right';
  }

  private get pattern(): RegExp {
    let pattern = '^';

    if (this.allowNegatives()) {
      pattern += '-?';
    }

    pattern += '\\d*';

    if (this.allowDecimals()) {
      pattern += '(\\.\\d*)?';
    }

    pattern += '$';
    return new RegExp(pattern);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'End', 'Home'];

    if (controlKeys.includes(event.key)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key)) {
      return;
    }

    if (event.key === '.' && this.allowDecimals()) {
      if (this.el.nativeElement.value.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === '-' && this.allowNegatives()) {
      const selectionStart = this.el.nativeElement.selectionStart || 0;
      if (selectionStart !== 0 || this.el.nativeElement.value.includes('-')) {
        event.preventDefault();
      }
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(): void {
    const currentValue = this.el.nativeElement.value;

    if (!this.pattern.test(currentValue)) {
      const selectionStart = this.el.nativeElement.selectionStart || 0;
      this.el.nativeElement.value = this.value();
      if (typeof this.el.nativeElement.setSelectionRange === 'function') {
        this.el.nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
      }
    } else {
      this.value.set(currentValue);
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';

    if (this.pattern.test(pastedText)) {
      const selectionStart = this.el.nativeElement.selectionStart || 0;
      const selectionEnd = this.el.nativeElement.selectionEnd || 0;
      const currentValue = this.el.nativeElement.value;

      const newValue = currentValue.substring(0, selectionStart) + pastedText + currentValue.substring(selectionEnd);

      if (this.pattern.test(newValue)) {
        this.el.nativeElement.value = newValue;
        this.value.set(newValue);
        const newCursorPosition = selectionStart + pastedText.length;
        this.el.nativeElement.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }
  }
}
