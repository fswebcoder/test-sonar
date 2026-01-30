import { Component, Input } from '@angular/core';

@Component({
  selector: 'svi-metric-card',
  imports: [],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  @Input({required: true}) title: string = '';
  @Input({required: true}) value: string = '';
  @Input({required: true}) icon: string = '';

}
