import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { PermissionDirective, PermissionConfig } from '@/core/directives/permission.directive';
import { TSeverityType } from '@/shared/types/severity-type.type';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'svi-card-button',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PermissionDirective, TooltipModule],
  template: `
    <ng-container *ngIf="permission as perm; else plainButton">
      <svi-button
        [label]="label"
        [icon]="icon"
        [severity]="severity"
        [variant]="variant"
        [size]="size"
        [outlined]="outlined"
        [styleClass]="styleClass"
        [fullWidth]="fullWidth"
        [disabled]="disabled"
        [pTooltip]="tooltip"
        [tooltipPosition]="tooltipPosition"
        [appPermission]="perm"
        (onClick)="clicked.emit($event)"
      ></svi-button>
    </ng-container>

    <ng-template #plainButton>
      <svi-button
        [label]="label"
        [icon]="icon"
        [severity]="severity"
        [variant]="variant"
        [size]="size"
        [outlined]="outlined"
        [styleClass]="styleClass"
        [fullWidth]="fullWidth"
        [disabled]="disabled"
        [pTooltip]="tooltip"
        [tooltipPosition]="tooltipPosition"
        (onClick)="clicked.emit($event)"
      ></svi-button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardButtonComponent {
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() severity: TSeverityType = 'primary';
  @Input() variant: 'text' | undefined = 'text';
  @Input() size: 'small' | 'large' | undefined = 'small';
  @Input() outlined: boolean = true;
  @Input() styleClass: string = 'w-full md:w-auto';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;
  @Input() tooltip?: string;
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' | 'mouse' = 'top';
  @Input() permission: PermissionConfig | string | null = null;

  @Output() clicked = new EventEmitter<MouseEvent>();
}
