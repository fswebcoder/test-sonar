import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface DropdownItem {
  label: string;
  icon?: string;
  command?: (event: { item: DropdownItem }) => void;
  disabled?: boolean;
  separator?: boolean;
  id?: string;
  branding?: any;
}

@Component({
  selector: 'svi-dropdown-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-button.component.html',
  styleUrl: './dropdown-button.component.scss',
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void <=> *', [
        animate('200ms ease')
      ])
    ])
  ]
})
export class DropdownButtonComponent {
  @Input() label: string = '';
  @Input() items: any[] = [];
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';
  @Input() icon?: string;
  
  @Output() itemClick = new EventEmitter<DropdownItem>();
  
  isOpen = signal(false);
  

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen.set(!this.isOpen());
    }
  }
  

  closeDropdown(): void {
    this.isOpen.set(false);
  }
  
  onItemClick(item: DropdownItem): void {
    if (!item.disabled && item.command) {
      item.command({ item });
      this.itemClick.emit(item);
      this.closeDropdown();
    }
  }
  

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.svi-dropdown-button')) {
      this.closeDropdown();
    }
  }
  

  trackByLabel(index: number, item: any): string {
    return item.label;
  }
} 