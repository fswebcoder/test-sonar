import { Component, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { IRoleEntity } from '@/domain/entities/admin/roles/role.entity';
import { IRoleDetailEntity } from '@/domain/entities/admin/roles/role-detail.entity';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { PaginationService } from '@/shared/services/pagination.service';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { CreateRolFormComponent } from '../components/create-rol-form/create-rol-form.component';
import { EditRolFormComponent } from '../components/edit-rol-form/edit-rol-form.component';
import { ViewRolComponent } from '../components/view-rol/view-rol.component';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { ICreateRolesParamsEntity } from '@/domain/entities/admin/roles/create-roles-params.entity';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { TPaginationParams } from '@SV-Development/utilities';

@Component({
  selector: 'svi-roles-dump',
  imports: [
    TableComponent,
    PaginatorComponent,
    CheckboxComponent,
    FormsModule,
    ButtonComponent,
    DialogComponent,
    CreateRolFormComponent,
    EditRolFormComponent,
    ViewRolComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './roles-dump.component.html',
  styleUrl: './roles-dump.component.scss'
})
export class RolesDumpComponent implements OnInit {
  roles = input.required<IRoleEntity[]>();
  actionsPermissions = input.required<IActionEntity[]>();
  roleDetailForEdit = input<IRoleDetailEntity | null>(null);
  roleDetailForView = input<IRoleDetailEntity | null>(null);
  paginationService = inject(PaginationService);

  @ViewChild(CreateRolFormComponent) createRolFormComponent!: CreateRolFormComponent;
  @ViewChild(EditRolFormComponent) editRolFormComponent!: EditRolFormComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  onParamsChange = output<TPaginationParams>();
  onCreateRole = output<ICreateRolesParamsEntity>();
  onUpdateRole = output<ICreateRolesParamsEntity>();
  onOpenEditRole = output<IRoleEntity>();
  onCloseEditRole = output<void>();
  onOpenViewRole = output<IRoleEntity>();
  onCloseViewRole = output<void>();
  onDeleteRole = output<IRoleEntity>();
  onActivateRole = output<IRoleEntity>();
  selectedRoleData = signal<IRoleEntity | null>(null);

  isDialogVisible = signal(false);
  isEditDialogVisible = signal(false);
  isViewDialogVisible = signal(false);
  confirmHeader = signal<string>('');
  confirmAcceptLabel = signal<string>('');
  confirmAcceptStyle = signal<string>('');

  ngOnInit(): void {
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  readonly columns: TableColumn[] = [
    {
      header: 'Nombre',
      field: 'name'
    },
    {
      header: 'Descripción',
      field: 'description'
    },
    {
      header: 'Estado',
      field: 'isActive',
      type: 'badge',
      badgeText: (item: boolean) => (item ? 'Activo' : 'Inactivo'),
      badgeColor: (item: boolean) => (item ? 'success' : 'danger'),
      badgeSeverity: (item: boolean) => (item ? 'success' : 'danger')
    }
  ];

  readonly actions: TableAction[] = [
    {
      icon: ICONS.EYE,
      action: (item: IRoleEntity) => this.openViewDialog(item),
      tooltip: 'Ver detalles',
  severity: EActionSeverity.ACTION,
      permission: {
        path: '/admin/roles',
        action: 'VER_ROLES'
      }
    },
    {
      icon: ICONS.PENCIL,
      action: (item: IRoleEntity) => this.openEditDialog(item),
      tooltip: 'Editar',
      disabled: (item: IRoleEntity) => !item.isActive,
  severity: EActionSeverity.EDIT,
      permission: {
        path: '/admin/roles',
        action: 'EDITAR_ROL'
      }
    },
    {
      icon: ICONS.TRASH,
      action: (item: IRoleEntity) => this.deleteRole(item),
      tooltip: 'Eliminar',
      disabled: (item: IRoleEntity) => !item.isActive,
  severity: EActionSeverity.DELETE,
      permission: {
        path: '/admin/roles',
        action: 'INACTIVAR_ROL'
      }
    },
    {
      icon: ICONS.CHECK_CIRCLE,
      action: (item: IRoleEntity) => this.activateRole(item),
      tooltip: 'Activar',
      disabled: (item: IRoleEntity) => item.isActive,
  severity: EActionSeverity.ACTIVATE,
      permission: {
        path: '/admin/roles',
        action: 'ACTIVAR_ROL'
      }
    }
  ];

  withDeletedChange(event: boolean) {
    this.paginationService.resetPagination();
    this.paginationService.setWithDeleted(event);
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  onPageChange(event: any) {
    this.onParamsChange.emit(this.paginationService.getPaginationParams());
  }

  openDialog() {
    this.isDialogVisible.set(true);
  }

  createRole(event: ICreateRolesParamsEntity) {
    this.onCreateRole.emit(event);
  }

  closeDialog() {
    this.isDialogVisible.set(false);
    this.createRolFormComponent.cancel();
  }

  openEditDialog(event: IRoleEntity) {
    this.selectedRoleData.set(event);
    this.isEditDialogVisible.set(true);
    this.onOpenEditRole.emit(event);
  }

  closeEditDialog() {
    this.isEditDialogVisible.set(false);
    this.selectedRoleData.set(null);
    this.onCloseEditRole.emit();
  }

  openViewDialog(role: IRoleEntity) {
    this.selectedRoleData.set(role);
    this.isViewDialogVisible.set(true);
    this.onOpenViewRole.emit(role);
  }

  closeViewDialog() {
    this.isViewDialogVisible.set(false);
    this.selectedRoleData.set(null);
    this.onCloseViewRole.emit();
  }

  updateRole(event: ICreateRolesParamsEntity) {
    this.onUpdateRole.emit(event);
  }

  deleteRole(role: IRoleEntity) {
    this.confirmHeader.set('Confirmar eliminación');
    this.confirmAcceptLabel.set('Eliminar');
    this.confirmAcceptStyle.set('p-button-danger');
    this.confirmDialog.show(
      `¿Está seguro que desea eliminar el rol "${role.name}"?`,
      () => {
        this.onDeleteRole.emit(role);
      },
      () => {}
    );
  }

  activateRole(role: IRoleEntity) {
    this.confirmHeader.set('Confirmar activación');
    this.confirmAcceptLabel.set('Activar');
    this.confirmAcceptStyle.set('p-button-success');
    this.confirmDialog.show(
      `¿Está seguro que desea activar el rol "${role.name}"?`,
      () => {
        this.onActivateRole.emit(role);
      },
      () => {}
    );
  }

  get totalRecords() {
    return this.paginationService.getTotalRecords();
  }
}
