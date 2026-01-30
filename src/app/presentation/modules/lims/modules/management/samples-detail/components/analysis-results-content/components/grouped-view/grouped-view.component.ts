import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface IGroupedElementDisplay {
  symbol: string;
  baseKey: string;
  formattedKey: string;
  mainValue: {
    hasValue: boolean;
    displayValue: string;
  };
  uncertaintyValue?: {
    hasValue: boolean;
    displayValue: string;
  };
  elementClass: string;
  tooltip: string;
}

@Component({
  selector: 'svi-grouped-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (filteredElements().length > 0) {
      <div class="periodic-table-grid">
        @for (element of filteredElements(); track element.symbol; let i = $index) {
          <div
            class="periodic-element grouped-element"
            [class]="element.elementClass"
            [title]="element.tooltip"
          >
            <div class="element-number">{{ i + 1 }}</div>
            <div class="element-content-grid">
              <div class="element-key-section">
                <div class="element-symbol">{{ element.symbol }}</div>
                <div class="element-name">{{ element.formattedKey }}</div>
              </div>
              <div class="element-separator"></div>
              <div class="element-value-section">
                <div class="element-value-row">
                  <div class="element-value-label">Valor</div>
                  <div class="element-value main-value">
                    @if (element.mainValue.hasValue) {
                      {{ element.mainValue.displayValue }}
                    } @else {
                      <span class="empty-value">-</span>
                    }
                  </div>
                </div>

                <div class="element-value-row">
                  <div class="element-value-label uncertainty-label">Incertidumbre</div>
                  <div class="element-value uncertainty-value">
                    @if (element.uncertaintyValue && element.uncertaintyValue.hasValue) {
                      {{ element.uncertaintyValue.displayValue }}
                    } @else {
                      <span class="empty-value">-</span>
                    }
                  </div>
                </div>
              </div>
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
  styleUrls: ['./grouped-view.component.scss']
})
export class GroupedViewComponent {
  elements = input<IGroupedElementDisplay[]>([]);
  filteredElements = input<IGroupedElementDisplay[]>([]);
  filterText = input<string>('');
} 