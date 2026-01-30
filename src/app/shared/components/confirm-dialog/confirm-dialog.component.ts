import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonComponent } from '../form/button/button.component';

export type DialogType = 'warning' | 'error' | 'success' | 'info' | 'question';

@Component({
  selector: 'svi-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  providers: [ConfirmationService]
})
export class ConfirmDialogComponent {
  @Input() header?: string;
  @Input() icon?: string;
  @Input() message?: string;
  @Input() style?: object;
  @Input() styleClass?: string;
  @Input() maskStyleClass?: string;
  @Input() acceptIcon?: string;
  @Input() acceptLabel?: string = 'Sí';
  @Input() closeAriaLabel?: string;
  @Input() acceptAriaLabel?: string;
  @Input() acceptVisible: boolean = true;
  @Input() rejectIcon?: string;
  @Input() rejectLabel?: string = 'No';
  @Input() rejectAriaLabel?: string;
  @Input() rejectVisible: boolean = true;
  @Input() acceptButtonStyleClass?: string;
  @Input() rejectButtonStyleClass: string = 'p-button-outlined';
  @Input() closeOnEscape: boolean = true;
  @Input() dismissableMask: boolean = true;
  @Input() blockScroll: boolean = true;
  @Input() rtl: boolean = false;
  @Input() closable: boolean = true;
  @Input() appendTo: any = 'body';
  @Input() key?: string;
  @Input() autoZIndex: boolean = true;
  @Input() baseZIndex: number = 0;
  @Input() transitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';
  @Input() focusTrap: boolean = true;
  @Input() defaultFocus: 'accept' | 'reject' | 'none' | 'close' = 'accept';
  @Input() breakpoints?: any;
  @Input() visible?: boolean;
  @Input() position:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'center';
  @Input() draggable: boolean = true;
  
  @Input() dialogType: DialogType = 'warning';
  @Input() showAnimation: boolean = true;
  @Input() customIcon?: string;
  @Input() customHeaderClass?: string;
  @Input() customContentClass?: string;
  @Input() customFooterClass?: string;

  @Output() onHide = new EventEmitter<any>();
  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();

  @ViewChild('messageTemplate') messageTemplate?: TemplateRef<any>;
  @ViewChild('headerTemplate') headerTemplate?: TemplateRef<any>;
  @ViewChild('footerTemplate') footerTemplate?: TemplateRef<any>;
  @ViewChild('iconTemplate') iconTemplate?: TemplateRef<any>;
  @ViewChild('rejectIconTemplate') rejectIconTemplate?: TemplateRef<any>;
  @ViewChild('acceptIconTemplate') acceptIconTemplate?: TemplateRef<any>;

  private acceptCallback?: Function;
  private rejectCallback?: Function;

  constructor(private confirmationService: ConfirmationService) {}


  show(
    message?: string, 
    accept?: Function, 
    reject?: Function, 
    options?: {
      type?: DialogType;
      header?: string;
      acceptLabel?: string;
      rejectLabel?: string;
      customIcon?: string;
    }
  ): void {
    this.acceptCallback = accept;
    this.rejectCallback = reject;

    if (options) {
      this.dialogType = options.type || this.dialogType;
      this.header = options.header || this.header;
      this.acceptLabel = options.acceptLabel || this.acceptLabel;
      this.rejectLabel = options.rejectLabel || this.rejectLabel;
      this.customIcon = options.customIcon || this.customIcon;
    }

    this.setupDialogIcons();

    this.confirmationService.confirm({
      message: message || this.message,
      header: this.header,
      icon: this.customIcon || this.icon,
      acceptLabel: this.acceptLabel,
      rejectLabel: this.rejectLabel,
      acceptIcon: this.acceptIcon,
      rejectIcon: this.rejectIcon,
      acceptVisible: this.acceptVisible,
      rejectVisible: this.rejectVisible,
      acceptButtonStyleClass: this.acceptButtonStyleClass,
      rejectButtonStyleClass: this.rejectButtonStyleClass,
      closeOnEscape: this.closeOnEscape,
      dismissableMask: this.dismissableMask,
      key: this.key,
      defaultFocus: this.defaultFocus
    });
  }


  private setupDialogIcons(): void {
    if (!this.customIcon) {
      switch (this.dialogType) {
        case 'warning':
          this.icon = 'fa-duotone fa-triangle-exclamation';
          break;
        case 'error':
          this.icon = 'fa-duotone fa-circle-exclamation';
          break;
        case 'success':
          this.icon = 'fa-duotone fa-circle-check';
          break;
        case 'info':
          this.icon = 'fa-duotone fa-circle-info';
          break;
        case 'question':
          this.icon = 'fa-duotone fa-circle-question';
          break;
        default:
          this.icon = 'fa-duotone fa-triangle-exclamation';
      }
    }

    if (!this.acceptIcon) {
      this.acceptIcon = 'fa-duotone fa-check';
    }
    if (!this.rejectIcon) {
      this.rejectIcon = 'fa-duotone fa-times';
    }
  }

  public getDialogStyleClass(): string {
    const baseClass = this.styleClass || '';
    const typeClass = `dialog-type-${this.dialogType}`;
    const animationClass = this.showAnimation ? 'with-animation' : '';
    
    return [baseClass, typeClass, animationClass].filter(Boolean).join(' ');
  }


  showWarning(message: string, accept?: Function, reject?: Function): void {
    this.show(message, accept, reject, { type: 'warning' });
  }

  showError(message: string, accept?: Function, reject?: Function): void {
    this.show(message, accept, reject, { type: 'error' });
  }

  showSuccess(message: string, accept?: Function, reject?: Function): void {
    this.show(message, accept, reject, { type: 'success' });
  }

  showInfo(message: string, accept?: Function, reject?: Function): void {
    this.show(message, accept, reject, { type: 'info' });
  }

  showQuestion(message: string, accept?: Function, reject?: Function): void {
    this.show(message, accept, reject, { type: 'question' });
  }

  close(): void {
    this.confirmationService.close();
  }


  accept(): void {
    if (this.acceptCallback) {
      this.acceptCallback();
    }
    this.onAccept.emit();
    this.confirmationService.close();
  }

  reject(): void {
    if (this.rejectCallback) {
      this.rejectCallback();
    }
    this.onReject.emit();
    this.confirmationService.close();
  }

  clear(): void {
    this.acceptCallback = undefined;
    this.rejectCallback = undefined;
    this.customIcon = undefined;
  }
}
