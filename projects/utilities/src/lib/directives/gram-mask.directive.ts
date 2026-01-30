import { DestroyRef, Directive, effect, ElementRef, HostListener, inject, model, output, signal } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sviGramMask]',
  standalone: true
})
export class GramMaskDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private readonly cursorPosition = signal<number>(0);
  private readonly isFormatting = signal<boolean>(false);

  private readonly formatEffect = effect(() => {
    if (this.isFormatting()) {
      setTimeout(() => {
        const input = this.elementRef.nativeElement;
        const newPosition = this.calculateNewCursorPosition(input.value);
        if (input && typeof input.setSelectionRange === 'function' && input === document.activeElement) {
          try {
            input.setSelectionRange(newPosition, newPosition);
          } catch (error) {
            console.debug('No se pudo establecer la posición del cursor:', error);
          }
        }

        this.isFormatting.set(false);
      });
    }
  });

  ngOnInit(): void {
    this.setupInputHandlers();
  }

  private setupInputHandlers(): void {
    const input = this.elementRef.nativeElement;

    if (input.type !== 'text' && input.type !== 'number') {
      input.type = 'text';
    }

    input.addEventListener('input', (event: Event) => {
      if (this.isFormatting()) return;

      const target = event.target as HTMLInputElement;
      const cursorPos = target.selectionStart || 0;
      this.cursorPosition.set(cursorPos);

      const formattedValue = this.formatGrams(target.value);
      this.updateValue(formattedValue);
    });

    input.addEventListener('blur', () => {
      const currentValue = input.value;
      if (currentValue) {
        const formattedValue = this.formatGramsOnBlur(currentValue);
        this.updateValue(formattedValue);
      }
    });

    input.addEventListener('keypress', (event: KeyboardEvent) => {
      const allowedKeys = /[0-9.,]/;
      const key = event.key;

      if (!allowedKeys.test(key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
      }
    });
  }

  private formatGrams(value: string): string {
    let cleaned = value.replace(/[^\d.,]/g, '');

    cleaned = cleaned.replace(/,/g, '.');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts.length === 2 && parts[1].length > 3) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 3);
    }

    if (cleaned.startsWith('.')) {
      cleaned = '0' + cleaned;
    }

    return cleaned;
  }

  private formatGramsOnBlur(value: string): string {
    const num = parseFloat(value);

    if (isNaN(num)) {
      return '';
    }

    return this.removeTrailingZeros(num.toFixed(3));
  }

  private removeTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '');
  }

  private calculateNewCursorPosition(newValue: string): number {
    const currentPos = this.cursorPosition();
    return Math.min(currentPos, newValue.length);
  }

  private updateValue(value: string): void {
    this.isFormatting.set(true);
    const input = this.elementRef.nativeElement;

    input.value = value;

    if (this.ngControl?.control) {
      const numericValue = value ? parseFloat(value) : null;
      this.ngControl.control.setValue(numericValue, { emitEvent: false });
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  getNumericValue(): number | null {
    const value = this.elementRef.nativeElement.value;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
}
