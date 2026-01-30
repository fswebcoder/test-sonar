import { IUserEntity } from '@/domain/entities/admin/users/user.entity';
import { Component, computed, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import {  TPaginationParams } from '@SV-Development/utilities';
import {  TableAction, TableColumn, TableComponent } from "@/shared/components/table/table.component";
import { PaginatorComponent } from "@/shared/components/paginator/paginator.component";
import { PaginationService } from '@/shared/services/pagination.service';
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { DialogComponent } from "@/shared/components/dialog/dialog.component";
import { UserFormComponent } from "../components/user-form/user-form.component";
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { IRoleCatalogResponseEntity } from '@/domain/entities/admin/roles/role-catalog-response.entity';
import { IUpdateUsersParamsEntity } from '@/domain/entities/admin/users/update-users-params.entity';
import { ICreateUsersParamsEntity } from '@/domain/entities/admin/users/create-users-params.entity';
import { ConfirmDialogComponent } from "@/shared/components/confirm-dialog/confirm-dialog.component";
import { CheckboxComponent } from "@/shared/components/form/checkbox/checkbox.component";
import { FormsModule } from '@angular/forms';
import { ICONS } from '@/shared/enums/general.enum';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { PermissionDirective } from '@/core/directives';

@Component({
  selector: 'svi-users-dump',
  imports: [TableComponent, PaginatorComponent, ButtonComponent, DialogComponent, UserFormComponent, ConfirmDialogComponent, CheckboxComponent, FormsModule, PermissionDirective],
  templateUrl: './users-dump.component.html',
  styleUrl: './users-dump.component.scss'
})
export class UsersDumpComponent {
  users = input.required<IUserEntity[]>();

  userFiltered = computed(() => this.users().map(res => {
    return {
      ...res,
      name: (res.name + ' ' + res.lastName).toLocaleUpperCase()
    }
  }));
  roles = input.required<IRoleCatalogResponseEntity[]>();
  
  paginationService = inject(PaginationService);

  userModal = signal<boolean>(false);
  userAction = signal<'create' | 'edit' | 'view'>('create');
  withDeleted = signal<boolean>(false);
  onCreateUser = output<ICreateUsersParamsEntity>();
  onUpdateUser = output<IUpdateUsersParamsEntity>();
  onActivateUser = output<string>();
  onDeactivateUser = output<string>();

  user = signal<IUserEntity | null>(null);
  documentTypes = input.required<IDocumentTypeResponse[]>();

  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  columns:TableColumn[] = ([
    { field: 'name', header: 'Nombre', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'roleName', header: 'Rol', type: 'text' },
    {
      header: 'Estado',
      field: 'isActive',
      type: 'badge',
      badgeText: (item: boolean ) => item ? 'Activo' : 'Inactivo',
      badgeColor: (item: boolean ) => item ? 'success' : 'danger',
      badgeSeverity: (item: boolean ) => item ? 'success' : 'danger',
    }
  ]);

  actions:TableAction[] = ([
    {
      icon: ICONS.EYE,
      action: (user: IUserEntity) => this.openUserModal('view', user),
      tooltip: 'Ver detalles',
        severity: EActionSeverity.VIEW,
      permission: { 
        path: '/admin/usuarios',
        action: 'VER_USUARIOS'
      }
    },
    {
      icon: ICONS.PENCIL,
      action: (user: IUserEntity) => this.openUserModal('edit', user),
      tooltip: 'Editar',
        severity: EActionSeverity.EDIT,
      permission: { 
        path: '/admin/usuarios',
        action: 'EDITAR_USUARIO'
      }
    },
    {
      icon: ICONS.XMARK_USER,
      action: (user: IUserEntity) => this.deleteUser(user),
      tooltip: 'Desactivar usuario',
      disabled: (user: IUserEntity) => !user.isActive,
        severity: EActionSeverity.DEACTIVATE,
      permission: { 
        path: '/admin/usuarios',
        action: 'INACTIVAR_USUARIO'
      }
    },
    {
      icon: ICONS.CHECK_USER,
      action: (user: IUserEntity) => this.activateUser(user),
      tooltip: 'Activar usuario',
        severity: EActionSeverity.ACTIVATE,
      disabled: (user: IUserEntity) => user.isActive,
      permission: {
        path: '/admin/usuarios',
        action: 'ACTIVAR_USUARIO'
      }
    },
  ]);

  ngOnInit(): void {
  }

  withDeletedChange(value: boolean) {
    this.withDeleted.set(value);
    this.paginationService.setWithDeleted(value);
  }

  openUserModal(action: 'create' | 'edit' | 'view', user?: IUserEntity) {
    this.userModal.set(true);
    this.userAction.set(action);
    this.user.set(user || null);
  }

  getModalTitle() {
    return this.userAction() === 'create' ? 'Crear usuario' : 
           this.userAction() === 'edit' ? 'Editar usuario' : 'Ver usuario';
  }

  createUser(user: ICreateUsersParamsEntity) {
    this.onCreateUser.emit(user);
  }
  updateUser(user: IUpdateUsersParamsEntity) {
    const data ={
      ...user,
      userId: this.user()?.userId || ''
    }
    this.onUpdateUser.emit(data);
  }

  activateUser(user: IUserEntity) {
    this.confirmDialog.show(
      `¿Está seguro que desea activar al usuario "${user.name}"?`,
      () => {
        this.onActivateUser.emit(user.userId); 
      },
      () => {}
    );
  }

  closeUserModal() {
    this.userModal.set(false);
    this.userAction.set('create');
    this.user.set(null);
    this.userFormComponent.resetForm();
  }

  deleteUser(user: IUserEntity) {
    this.confirmDialog.show(
      `¿Está seguro que desea eliminar al usuario "${user.name}"?`,
      () => {
        this.onDeactivateUser.emit(user.userId);
      },
        () => {}
      );
    }
  

  get totalRecords() {
      return this.paginationService.getTotalRecords();
  }

  paramsChange(params: TPaginationParams) {
    this.paginationService.updatePagination({
      ...this.paginationService.getPaginationParams(),
      ...params
    });
  }
}
