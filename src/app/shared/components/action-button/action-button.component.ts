import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { TSeverityType } from '@/shared/types/severity-type.type';

export type ActionButtonType = 'view' | 'edit' | 'delete' | 'custom';

export interface ActionButtonConfig {
  type: ActionButtonType;
  icon?: string;
  tooltip?: string;
  severity?: TSeverityType;
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'svi-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, TooltipModule]
})
export class ActionButtonComponent {
  @Input() config!: ActionButtonConfig;
  @Input() customIcon?: string;
  @Input() customTooltip?: string;
  @Input() customSeverity?: TSeverityType;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Output() actionClick = new EventEmitter<ActionButtonType>();

  private readonly defaultConfigs: Record<ActionButtonType, Partial<ActionButtonConfig>> = {
    view: {
      icon: 'fa-duotone fa-solid fa-eye',
      tooltip: 'Ver',
      severity: EActionSeverity.VIEW
    },
    edit: {
      icon: 'fa-duotone fa-solid fa-pen-to-square',
      tooltip: 'Editar',
      severity: EActionSeverity.EDIT
    },
    delete: {
      icon: 'fa-duotone fa-regular fa-trash',
      tooltip: 'Eliminar',
      severity: EActionSeverity.DELETE
    },
    custom: {
      icon: '',
      tooltip: '',
      severity: EActionSeverity.ACTION
    }
  };

  get buttonConfig(): ActionButtonConfig {
    const defaultConfig = this.defaultConfigs[this.config.type];
    
    return {
      ...defaultConfig,
      ...this.config,
      icon: this.customIcon || this.config.icon || defaultConfig.icon,
      tooltip: this.customTooltip || this.config.tooltip || defaultConfig.tooltip,
      severity: this.customSeverity || this.config.severity || defaultConfig.severity,
      disabled: this.disabled || this.config.disabled || false,
      loading: this.loading || this.config.loading || false
    };
  }

  onButtonClick(): void {
    if (!this.buttonConfig.disabled && !this.buttonConfig.loading) {
      this.actionClick.emit(this.config.type);
    }
  }
} 