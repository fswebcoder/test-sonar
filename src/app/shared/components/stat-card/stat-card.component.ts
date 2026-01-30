import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svi-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [ngClass]="[variant(), size()]">
      @if (icon()) {
        <div class="stat-icon">
          <i class="{{ icon() }}"></i>
        </div>
      }
      <div class="stat-content">
        <div class="stat-number">{{ value() }}</div>
        <div class="stat-label">{{ label() }}</div>
      </div>
      @if (showProgressBar()) {
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  value = input.required<string | number>();
  label = input.required<string>();
  icon = input<string>();
  variant = input<string>('primary'); // 'primary', 'secondary', 'accent'
  size = input<'default' | 'compact'>('default');
  showProgressBar = input<boolean>(false);
  progressPercentage = input<number>(0);
}
