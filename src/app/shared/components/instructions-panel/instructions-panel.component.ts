import { ICONS } from '@/shared/enums/general.enum';
import { Component, input } from '@angular/core';
import { PanelModule } from 'primeng/panel';

export interface InstructionItem {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

@Component({
  selector: 'svi-instructions-panel',
  templateUrl: './instructions-panel.component.html',
  styleUrls: ['./instructions-panel.component.scss'],
  imports: [PanelModule]
})
export class InstructionsPanelComponent {
  ICONS = ICONS;

  toggleable = input<boolean>(true);
  title = input.required<string>();
  description = input<string>('');
  instructions = input.required<InstructionItem[]>();
  icon = input<string>('fa-duotone fa-regular fa-circle-info');
  iconColor = input<string>('text-blue-400');
  titleColor = input<string>('text-blue-800');
  textColor = input<string>('text-blue-700');
}
