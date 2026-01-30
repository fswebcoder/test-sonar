import { Component, input, output, signal, ViewChild } from '@angular/core';

import { ISupplierContactEntity, ICreateSupplierContactParamsEntity, IUpdateSupplierContactParamsEntity } from '@/domain/entities/suppliers/notifications';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { FormMode } from '@/shared/types/form-mode.type';
import { SupplierContactFormComponent } from '../components/supplier-contact-form/supplier-contact-form.component';
import { ESupplierContactActions } from '@/presentation/modules/suppliers/actions.enum';

@Component({
  selector: 'svi-supplier-contacts-dump',
  templateUrl: './supplier-contacts-dump.component.html',
  styleUrl: './supplier-contacts-dump.component.scss',
  imports: [
    ButtonComponent,
    TableComponent,
    DialogComponent,
    ConfirmDialogComponent,
    SupplierContactFormComponent
  ]
})
export class SupplierContactsDumpComponent {

  ICONS = ICONS;

  private readonly path = '/proveedores/contactos';

  data = input.required<ISupplierContactEntity[]>();

  contactCreated = output<ICreateSupplierContactParamsEntity>();
  contactEdited = output<IUpdateSupplierContactParamsEntity>();
  contactActivated = output<string>();
  contactInactivated = output<string>();

  mode = signal<FormMode | null>(null);
  dialogOpen = signal<boolean>(false);
  selectedContact = signal<ISupplierContactEntity | null>(null);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  columns = signal<TableColumn[]>([
    { field: 'name', header: 'Nombre', type: 'text', width: '25%' },
    { field: 'email', header: 'Correo', type: 'text', width: '30%' },
    { field: 'position', header: 'Cargo', type: 'text', width: '20%' },
    { field: 'phone', header: 'Teléfono', type: 'text', width: '15%' },
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
      icon: ICONS.EYE,
      tooltip: 'Ver detalles',
      action: (row: ISupplierContactEntity) => this.openDialog('view', row),
      severity: EActionSeverity.VIEW,
      permission: {
        action: ESupplierContactActions.VER_CONTACTOS,
        path: this.path
      }
    },
    {
      icon: ICONS.PENCIL,
      tooltip: 'Editar',
      action: (row: ISupplierContactEntity) => this.openDialog('edit', row),
      severity: EActionSeverity.EDIT,
      permission: {
        action: ESupplierContactActions.EDITAR_CONTACTO,
        path: this.path
      }
    },
    {
      icon: ICONS.TRASH,
      tooltip: 'Inactivar',
      action: (row: ISupplierContactEntity) => this.showInactivateDialog(row),
      severity: EActionSeverity.DELETE,
      disabled: (row: ISupplierContactEntity) => !row.isActive,
      permission: {
        action: ESupplierContactActions.ELIMINAR_CONTACTO,
        path: this.path
      }
    },
    {
      icon: ICONS.CHECK_CIRCLE,
      tooltip: 'Activar',
      action: (row: ISupplierContactEntity) => this.showActivateDialog(row),
      severity: EActionSeverity.ACTIVATE,
      disabled: (row: ISupplierContactEntity) => row.isActive,
      permission: {
        action: ESupplierContactActions.ACTIVAR_CONTACTO,
        path: this.path
      }
    }
  ]);

  get dialogTitle(): string {
    switch (this.mode()) {
      case 'create':
        return 'Crear Contacto';
      case 'edit':
        return 'Editar Contacto';
      default:
        return 'Ver Contacto';
    }
  }

  openDialog(mode: FormMode = 'create', row: ISupplierContactEntity | null = null): void {
    this.mode.set(mode);
    this.selectedContact.set(row);
    this.dialogOpen.set(true);
  }

  closeAllDialogs(): void {
    this.dialogOpen.set(false);
    this.selectedContact.set(null);
    this.mode.set(null);
  }

  createContact(data: ICreateSupplierContactParamsEntity): void {
    this.contactCreated.emit(data);
  }

  editContact(data: IUpdateSupplierContactParamsEntity): void {
    this.contactEdited.emit(data);
  }

  private showInactivateDialog(data: ISupplierContactEntity): void {
    this.confirmDialog.show(
      `¿Estás seguro de que deseas inactivar el contacto "${data.name}"?`,
      () => {
        this.contactInactivated.emit(data.id);
      },
      () => {}
    );
  }

  private showActivateDialog(data: ISupplierContactEntity): void {
    this.confirmDialog.show(
      `¿Estás seguro de que deseas activar el contacto "${data.name}"?`,
      () => {
        this.contactActivated.emit(data.id);
      },
      () => {}
    );
  }
}
