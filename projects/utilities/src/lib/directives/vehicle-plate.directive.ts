import { Directive, DestroyRef, HostListener, Input, OnInit, Optional, Host, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[sviVehiclePlate]',
  standalone: true
})
export class VehiclePlateDirective implements OnInit {
  private readonly maxLength: number = 6;
  private isUpdating = false;

  @Input() allowHyphen = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    @Optional()
    @Host()
    private readonly ngControl: NgControl
  ) {}

  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    const initialValue = control.value;
    const formattedInitial = this.formatPlate(initialValue);
    if (formattedInitial !== initialValue) this.applyValue(formattedInitial, false);

    control.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (this.isUpdating) return;

        const formatted = this.formatPlate(value);
        if (formatted === value || (formatted === '' && (value === null || value === undefined || value === ''))) return;

        this.applyValue(formatted, true);
      });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const control = this.ngControl?.control;
    if (!control || control.disabled) return;

    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x', 'z', 'y'].includes(event.key.toLowerCase())) return;

    const navigationKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'];
    if (navigationKeys.includes(event.key)) return;

    const { letters, digits } = this.countSegments(control.value);
    const isLetter = /^[a-zA-Z]$/.test(event.key);
    const isDigit = /^\d$/.test(event.key);
    const isHyphen = event.key === '-';

    if (isLetter) {
      if (letters >= 3) event.preventDefault();
      return;
    }

    if (isDigit) {
      if (letters < 3 || digits >= 3) event.preventDefault();
      return;
    }

    if (this.allowHyphen && isHyphen) {
      const currentValue = (control.value as string | null | undefined) ?? '';
      if (letters !== 3 || digits === 0 || currentValue.includes('-')) event.preventDefault();
      return;
    }

    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const control = this.ngControl?.control;
    if (!control || control.disabled) return;

    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const formatted = this.formatPlate(pasted);
    this.applyValue(formatted, true);
  }

  private applyValue(value: string, emitEvent: boolean): void {
    const control = this.ngControl?.control;
    if (!control) return;

    this.isUpdating = true;
    control.setValue(value, { emitEvent });
    this.isUpdating = false;
  }

  private formatPlate(raw: unknown): string {
    if (typeof raw !== 'string') return '';

    const sanitized = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let letters = '';
    let numbers = '';

    for (const char of sanitized) {
      if (letters.length < 3 && /[A-Z]/.test(char)) {
        letters += char;
        continue;
      }

      if (letters.length === 3 && numbers.length < 3 && /[0-9]/.test(char)) {
        numbers += char;
        continue;
      }

      if (letters.length === 3 && numbers.length === 3) break;
    }

    let combined = `${letters}${numbers}`;
    if (combined.length > this.maxLength) combined = combined.slice(0, this.maxLength);

    if (this.allowHyphen && combined.length > 3) return `${combined.slice(0, 3)}-${combined.slice(3)}`;

    return combined;
  }

  private countSegments(raw: unknown): { letters: number; digits: number } {
    const formatted = this.formatPlate(typeof raw === 'string' ? raw : '').replace('-', '');
    const letters = formatted.slice(0, 3).replace(/[^A-Z]/g, '').length;
    const digits = formatted.slice(letters).replace(/[^0-9]/g, '').length;
    return { letters, digits };
  }
}
