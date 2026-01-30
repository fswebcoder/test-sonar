import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'svi-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() width: string = '50%';
  @Input() height: string = 'auto';
  @Input() modal: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() dismissableMask: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() closeIcon: string = 'pi pi-times';
  @Input() acceptLabel: string = 'Aceptar';
  @Input() rejectLabel: string = 'Cancelar';
  @Input() acceptIcon: string = 'fa-solid fa-check';
  @Input() rejectIcon: string = 'fa-solir fa-cancel ';
  @Input() acceptButtonClass: string = 'p-button-primary';
  @Input() rejectButtonClass: string = 'secondary';
  @Input() draggable: boolean = false;
  @Input() resizable: boolean = false;
  @Input() position: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'top';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();
  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  handleAccept(): void {
    this.onAccept.emit();
    this.closeDialog();
  }

  handleReject(): void {
    this.onReject.emit();
    this.closeDialog();
  }
}
