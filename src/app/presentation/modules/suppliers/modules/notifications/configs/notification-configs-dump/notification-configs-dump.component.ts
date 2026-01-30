import { Component, input, output, signal, ViewChild } from '@angular/core';

import {
  ISupplierNotificationConfigEntity,
  ICreateNotificationConfigParamsEntity,
  INotificationTypeEntity,
  ISupplierContactEntity
} from '@/domain/entities/suppliers/notifications';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { NotificationConfigFormComponent } from '../components/notification-config-form/notification-config-form.component';
import { ENotificationConfigActions } from '@/presentation/modules/suppliers/actions.enum';

@Component({
  selector: 'svi-notification-configs-dump',
  templateUrl: './notification-configs-dump.component.html',
  styleUrl: './notification-configs-dump.component.scss',
  imports: [
    ButtonComponent,
    TableComponent,
    DialogComponent,
    ConfirmDialogComponent,
    NotificationConfigFormComponent
  ]
})
export class NotificationConfigsDumpComponent {

  ICONS = ICONS;

  private readonly path = '/proveedores/configuracion-notificaciones';

  data = input.required<ISupplierNotificationConfigEntity[]>();
  notificationTypes = input.required<INotificationTypeEntity[]>();
  contacts = input.required<ISupplierContactEntity[]>();

  configCreated = output<ICreateNotificationConfigParamsEntity>();
  configActivated = output<string>();
  configInactivated = output<string>();

  dialogOpen = signal<boolean>(false);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  columns = signal<TableColumn[]>([
    { 
      field: 'supplierContact', 
      header: 'Contacto', 
      width: '30%',
      template: (row: ISupplierNotificationConfigEntity) => row.supplierContact?.name || '-'
    },
    { 
      field: 'supplierContactEmail', 
      header: 'Correo', 
      width: '30%',
      template: (row: ISupplierNotificationConfigEntity) => row.supplierContact?.email || '-'
    },
    { 
      field: 'notificationType', 
      header: 'Tipo de Notificación', 
      width: '30%',
      template: (row: ISupplierNotificationConfigEntity) => row.notificationType?.name || '-'
    },
    {
      field: 'isActive',
      header: 'Estado',
      type: 'badge',
      width: '10%',
      align: 'center',
      badgeSeverity: (value) => value ? 'success' : 'warn',
      badgeText: (value) => value ? 'Activo' : 'Inactivo',
    }
  ]);

  actions = signal<TableAction[]>([
    {
      icon: ICONS.TRASH,
      tooltip: 'Eliminar',
      action: (row: ISupplierNotificationConfigEntity) => this.showInactivateDialog(row),
      severity: EActionSeverity.DELETE,
      disabled: (row: ISupplierNotificationConfigEntity) => !row.isActive,
      permission: {
        action: ENotificationConfigActions.ELIMINAR_CONFIGURACION_NOTIFICACION,
        path: this.path
      }
    },
    {
      icon: ICONS.CHECK_CIRCLE,
      tooltip: 'Activar',
      action: (row: ISupplierNotificationConfigEntity) => this.showActivateDialog(row),
      severity: EActionSeverity.ACTIVATE,
      disabled: (row: ISupplierNotificationConfigEntity) => row.isActive,
      permission: {
        action: ENotificationConfigActions.ACTIVAR_CONFIGURACION_NOTIFICACION,
        path: this.path
      }
    }
  ]);

  openDialog(): void {
    this.dialogOpen.set(true);
  }

  closeAllDialogs(): void {
    this.dialogOpen.set(false);
  }

  createConfig(data: ICreateNotificationConfigParamsEntity): void {
    this.configCreated.emit(data);
  }

  private showInactivateDialog(data: ISupplierNotificationConfigEntity): void {
    const contactName = data.supplierContact?.name || 'este contacto';
    const typeName = data.notificationType?.name || 'esta notificación';
    this.confirmDialog.show(
      `¿Estás seguro de que deseas eliminar la configuración de "${typeName}" para "${contactName}"?`,
      () => {
        this.configInactivated.emit(data.id);
      },
      () => {}
    );
  }

  private showActivateDialog(data: ISupplierNotificationConfigEntity): void {
    const contactName = data.supplierContact?.name || 'este contacto';
    const typeName = data.notificationType?.name || 'esta notificación';
    this.confirmDialog.show(
      `¿Estás seguro de que deseas activar la configuración de "${typeName}" para "${contactName}"?`,
      () => {
        this.configActivated.emit(data.id);
      },
      () => {}
    );
  }
}
