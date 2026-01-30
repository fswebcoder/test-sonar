import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

export interface ViewOption {
  value: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

@Component({
  selector: 'svi-view-switcher',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './view-switcher.component.html',
  styleUrl: './view-switcher.component.scss'
})
export class ViewSwitcherComponent {
  options = input<ViewOption[]>([
    { value: 'table', label: 'Tabla', icon: 'pi pi-bars' },
    { value: 'cards', label: 'Tarjetas', icon: 'pi pi-table' }
  ]);

  value = input<string>('table');
  disabled = input<boolean>(false);
  size = input<'small' | 'normal' | 'large'>('normal');
  variant = input<'default' | 'outlined' | 'filled'>('default');
  showLabels = input<boolean>(true);
  showIcons = input<boolean>(true);

  valueChange = output<string>();
  viewChanged = output<string>();

  private internalValue = signal<string>('table');

  currentValue = computed(() => this.value() || this.internalValue());
  
  availableOptions = computed(() => {
    const opts = this.options();
    return this.disabled() ? opts.map(opt => ({ ...opt, disabled: true })) : opts;
  });

  buttonClasses = computed(() => {
    const sizeClass = this.getSizeClass();
    const variantClass = this.getVariantClass();
    return `view-switcher-button ${sizeClass} ${variantClass}`;
  });

  containerClasses = computed(() => {
    const sizeClass = this.getSizeClass();
    return `view-switcher-container ${sizeClass}`;
  });

  private getSizeClass(): string {
    switch (this.size()) {
      case 'small': return 'size-small';
      case 'large': return 'size-large';
      default: return 'size-normal';
    }
  }

  private getVariantClass(): string {
    switch (this.variant()) {
      case 'outlined': return 'variant-outlined';
      case 'filled': return 'variant-filled';
      default: return 'variant-default';
    }
  }

  changeView(value: string) {
    if (this.disabled()) return;
    
    const option = this.availableOptions().find(opt => opt.value === value);
    if (!option || option.disabled) return;

    this.internalValue.set(value);
    this.valueChange.emit(value);
    this.viewChanged.emit(value);
  }

  isActive(value: string): boolean {
    return this.currentValue() === value;
  }

  isDisabled(value: string): boolean {
    const option = this.availableOptions().find(opt => opt.value === value);
    return option?.disabled || this.disabled() || false;
  }
}
