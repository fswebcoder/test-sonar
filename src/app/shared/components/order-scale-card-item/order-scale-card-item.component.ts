import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'svi-order-scale-card-item',
  imports: [CommonModule, TooltipModule],
  styleUrls: ['./order-scale-card-item.component.scss'],
  template: `
    <li class="item" [pTooltip]="tooltip()" tooltipPosition="top">
      <span class="icon">
        <i [ngClass]="icon()"></i>
      </span>
      <div class="text">
        <span class="value">{{ label() }}</span>
      </div>
    </li>
  `
})
export class OrderScaleCardItemComponent {
  icon = input.required<string>();
  label = input.required<string>();
  tooltip = input.required<string>();
}
