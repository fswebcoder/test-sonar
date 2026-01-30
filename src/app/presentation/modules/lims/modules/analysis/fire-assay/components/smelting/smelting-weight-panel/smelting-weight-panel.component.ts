import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-smelting-weight-panel',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './smelting-weight-panel.component.html',
  styleUrls: ['./smelting-weight-panel.component.scss']
})
export class SmeltingWeightPanelComponent {
  @Input() assigned = 0;
  @Input() total = 0;
  @Input() canFinalize = false;
  @Input() finished = false;
  @Output() finalize = new EventEmitter<void>();
  ICONS = ICONS;
  onFinalize(){ if(this.canFinalize && !this.finished) this.finalize.emit(); }
}
