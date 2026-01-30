import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'svi-leachwell-card-content',
  templateUrl: './leachwell-card-content.component.html',
  styleUrls: ['./leachwell-card-content.component.scss']
})
export class LeachwellCardContentComponent {
  readonly circumference = 2 * Math.PI * 45;

  progressPercentage = input.required<number>();
  isOverdue = input.required<boolean>();
  duration = input.required<number>();
  sampleCode = input.required<string>();
  startDate = input.required<Date>();
  endDate = input.required<Date>();
}
