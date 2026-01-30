import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'svi-xrf-periodic-table',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    @if (filteredElements().length > 0) {
      <div class="xrf-periodic-table">
        @for (element of filteredElements(); track element.atomicNumber) {
          <div
            class="periodic-element xrf-element"
            [pTooltip]="element.name + ' (' + element.symbol + ') - Número atómico: ' + element.atomicNumber"
            [class.has-value]="element.hasValue"
            [class.no-value]="!element.hasValue"
          >
            <div class="element-atomic-number">{{ element.atomicNumber }}</div>
            <div class="element-symbol">{{ element.symbol }}</div>
            <div class="element-name">{{ element.name }}</div>
            <div class="element-value">
              {{ getDisplayValue(element) }}
            </div>
          </div>
        }
      </div>
    } @else if (filterText() && filteredElements().length === 0) {
      <div class="text-center py-6">
        <i class="fa-duotone fa-search text-gray-400 text-4xl mb-3 block"></i>
        <p class="text-gray-600 m-0">No se encontraron elementos que coincidan con "{{ filterText() }}"</p>
      </div>
    } @else if (elements().length === 0) {
      <div class="text-center py-6">
        <i class="fa-duotone fa-atom text-gray-400 text-4xl mb-3 block"></i>
        <p class="text-gray-600 m-0">No hay elementos químicos detectados</p>
      </div>
    }
  `,
  styleUrls: ['./xrf-periodic-table.component.scss']
})
export class XrfPeriodicTableComponent {
  elements = input<any[]>([]);
  filteredElements = input<any[]>([]);
  filterText = input<string>('');

  getDisplayValue(element: any): string {
    const value = element.value ?? 0;
    const error = element.error ?? 0;
    if (value === null && error === null) return '-';
    return `${value} ± ${error}`;
  }
}
