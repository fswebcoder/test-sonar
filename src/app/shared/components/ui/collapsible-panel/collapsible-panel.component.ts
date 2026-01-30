import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'svi-collapsible-panel',
  imports: [CommonModule, PanelModule],
  templateUrl: './collapsible-panel.component.html',
  styleUrl: './collapsible-panel.component.scss'
})
export class CollapsiblePanelComponent {
  // Inputs
  toggleable = input<boolean>(true);
  collapsed = input<boolean>(true);
  styleClass = input<string>('');
  headerContent = input<any>(null);

  // Outputs
  panelToggle = output<any>();

  onToggle(event: any) {
    this.panelToggle.emit(event);
  }
}
