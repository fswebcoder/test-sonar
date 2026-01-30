import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-cupellation-weight-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cupellation-weight-panel.component.html',
  styleUrls: ['./cupellation-weight-panel.component.scss']
})
export class CupellationWeightPanelComponent {
  @Input() assigned = 0;
  @Input() total = 0;
  @Input() canFinalize = false;
  @Input() finished = false;
  @Output() finalize = new EventEmitter<void>();
  ICONS = ICONS;
  onFinalize(){ if(this.canFinalize && !this.finished) this.finalize.emit(); }
}
