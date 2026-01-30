import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svi-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon: string = 'fa-box-open';
  @Input() title: string = 'No hay datos disponibles';
  @Input() description: string = 'No se encontraron registros. Intenta ajustar los filtros o crear un nuevo registro.';
  @Input() iconSize: string = 'text-6xl';
  @Input() containerClass: string = '';
}
