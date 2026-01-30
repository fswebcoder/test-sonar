import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'svi-scale-card',
  standalone: true,
  imports: [CommonModule, Tooltip],
  templateUrl: './scale-card.component.html',
  styleUrl: './scale-card.component.scss'
})
export class ScaleCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  subtitle = input<string>();
  statusLabel = input<string>();
  statusType = input<'active' | 'inactive' | 'neutral'>('neutral');
  actionsClass = input<string>('');
  cardClass = input<string>('');

  statusClass = computed(() => {
    const type = this.statusType();
    if (type === 'active') {
      return 'scale-card__status--active';
    }

    if (type === 'inactive') {
      return 'scale-card__status--inactive';
    }

    return '';
  });
}
