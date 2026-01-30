import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svi-max-weight-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './max-weight-info.component.html',
  styleUrls: ['./max-weight-info.component.scss']
})
export class MaxWeightInfoComponent {
  @Input() maxWeightGrams!: number;
  @Input() unit: 'gr' | 'kg' = 'gr';
  @Input() showBothUnits: boolean = true;
  @Input() locale: string = 'es-ES';
}
