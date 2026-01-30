import { Component, Input } from '@angular/core';

@Component({
  selector: 'svi-metric-item',
  standalone: true,
  imports: [],
  templateUrl: './metric-item.component.html',
  styleUrl: './metric-item.component.scss'
})
export class MetricItemComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  
}
