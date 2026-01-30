import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'svi-filter-section',
  standalone: true,
  imports: [CommonModule, ButtonModule, FloatInputComponent, ReactiveFormsModule],
  template: `
    <div class="bg-primary-50 p-3 card">
      <div class="flex align-items-center justify-content-between flex-col md:flex-row gap-2">
        <div class="flex align-items-center gap-2">
          <i class="fa-duotone fa-atom text-primary-500 text-lg my-auto"></i>
          <h3 class="font-semibold text-primary-800 m-0">
            @if (isXrfAnalysis()) {
              Tabla Periódica XRF
            } @else {
              Vista agrupada
            }
          </h3>
        </div>
        <!-- Campo de filtro -->
        <div class="flex align-items-center gap-2">
          <svi-float-input [label]="'Filtrar por elemento'" [formControl]="filterControl()" />
          @if (filterText()) {
            <p-button
              icon="fa-duotone fa-times"
              severity="secondary"
              size="small"
              [text]="true"
              (onClick)="clearFilter.emit()"
              [title]="'Limpiar filtro'"
            ></p-button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class FilterSectionComponent {
  isXrfAnalysis = input<boolean>(false);
  filterControl = input<any>();
  filterText = input<string>('');
  clearFilter = output<void>();
}
