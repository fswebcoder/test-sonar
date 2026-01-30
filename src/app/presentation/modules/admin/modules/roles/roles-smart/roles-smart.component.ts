import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RolesDumpComponent } from '../roles-dump/roles-dump.component';
import { RolesUseCase } from '@/domain/use-cases/admin/roles/roles.usecase';
import { LOAD_DATA_ERROR_TITLE } from '@/shared/constants/general.contant';
import { lastValueFrom } from 'rxjs';
import { LoadingService } from '@/shared/services/loading.service';
import { PaginatedData, ToastCustomService, TPaginationParams } from '@SV-Development/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { IRoleEntity } from '@/domain/entities/admin/roles/role.entity';
import { IRoleDetailEntity } from '@/domain/entities/admin/roles/role-detail.entity';
import { ActionsUseCase } from '@/domain/use-cases/common/actions.usecase';
import { IActionEntity } from '@/domain/entities/common/action.entity';
import { ICreateRolesParamsEntity } from '@/domain/entities/admin/roles/create-roles-params.entity';
import { PaginationService } from '@/shared/services/pagination.service';
import { Store } from '@ngrx/store';
import { getRolesAction } from '@/store/actions/common/common.action';
import { setCompanyAction } from '@/store/actions/auth/auth.actions';
import { selectActiveCompany, selectCompanyId } from '@/store/selectors/auth.selectors';

@Component({
  selector: 'svi-roles-smart',
  imports: [RolesDumpComponent],
  templateUrl: './roles-smart.component.html',
  styleUrl: './roles-smart.component.scss'
})
export class RolesSmartComponent implements OnInit {
  private rolesUseCase = inject(RolesUseCase);
  private actionsUseCase = inject(ActionsUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly store = inject(Store);

  private readonly paginationService = inject(PaginationService);
  @ViewChild(RolesDumpComponent) rolesDumpComponent!: RolesDumpComponent;

  roleDetailForEdit = signal<IRoleDetailEntity | null>(null);
  roleDetailForView = signal<IRoleDetailEntity | null>(null);

  private rolesData = signal<PaginatedData<IRoleEntity> | null>(null);
  private actionsData = signal<IActionEntity[]>([]);
  private isLoadingRoles = false;
  private companyId = signal<string | null>(null);
  rolActive$ = signal<string>('');
  ngOnInit() {
    this.paginationService.resetPagination();
    this.loadRoles();
    this.loadActions();
    this.store.select(selectActiveCompany).subscribe(company => {
      this.rolActive$.set(company?.role ?? '');
    });

  }

  rolesQueryData = computed(() => {
    return this.rolesData() || { items: [], meta: this.getDefaultMeta() };
  });

  actionsQueryData = computed(() => {
    return this.actionsData();
  });

  rolesItems = computed(() => {
    const data = this.rolesQueryData();
    return data?.items || [];
  });

  rolesMeta = computed(() => {
    const data = this.rolesQueryData();
    return data?.meta || this.getDefaultMeta();
  });

  private async loadRoles() {
    if (this.isLoadingRoles) return;

    this.isLoadingRoles = true;
    this.loadingService.startLoading('general');
    try {
      const response = await lastValueFrom(this.rolesUseCase.getAll(this.paginationService.getPaginationParams()));
      this.paginationService.setTotalRecords(response.data?.meta?.total || 0);
      this.rolesData.set(response.data);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('general');
      this.isLoadingRoles = false;
    }
  }

  private async loadActions() {
    this.loadingService.startLoading('general');
    try {
      const response = await lastValueFrom(this.actionsUseCase.getAll());
      this.actionsData.set(response.data || []);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('general');
    }
  }

  private handleQueryError(error: HttpErrorResponse) {
    return error.status === 401 ? null : this.toastCustomService.error(error.error.message || LOAD_DATA_ERROR_TITLE);
  }

  paramsChange(params: TPaginationParams) {
    this.paginationService.updatePagination({
      ...this.paginationService.getPaginationParams(),
      ...params
    });
    this.loadRoles();
  }

  private getDefaultMeta() {
    return {
      ...this.paginationService.getPaginationParams()
    };
  }

  createRole(event: ICreateRolesParamsEntity) {
    this.loadingService.setButtonLoading('create-role-button', true);
    this.rolesUseCase.create(event).subscribe({
      next: () => {
        this.toastCustomService.success('Rol creado correctamente');
        this.rolesDumpComponent.closeDialog();
        this.loadRoles();
        this.loadingService.setButtonLoading('create-role-button', false);
        this.store.dispatch(getRolesAction());
      },
      error: error => {
        this.toastCustomService.error(error.error.message || LOAD_DATA_ERROR_TITLE);
        this.loadingService.setButtonLoading('create-role-button', false);
      }
    });
  }

  loadRoleDetail(role: IRoleEntity) {
    this.loadingService.startLoading('general');

    this.rolesUseCase.getDetail(role.id).subscribe({
      next: response => {
        if (response?.data) {
          this.roleDetailForEdit.set(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastCustomService.error(error.error.message || 'Error al cargar los detalles del rol');
      },
      complete: () => {
        this.loadingService.stopLoading('general');
      }
    });
  }

  loadRoleDetailForView(role: IRoleEntity) {
    this.loadingService.startLoading('general');

    this.rolesUseCase.getDetail(role.id).subscribe({
      next: response => {
        if (response?.data) {
          this.roleDetailForView.set(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastCustomService.error(error.error.message || 'Error al cargar los detalles del rol');
      },
      complete: () => {
        this.loadingService.stopLoading('general');
      }
    });
  }

  clearRoleDetail() {
    this.roleDetailForEdit.set(null);
  }

  clearRoleDetailForView() {
    this.roleDetailForView.set(null);
  }

  updateRole(event: ICreateRolesParamsEntity) {
    const roleDetail = this.roleDetailForEdit();
    if (!roleDetail?.id) {
      this.toastCustomService.error('No se pudo identificar el rol a actualizar');
      return;
    }

    this.loadingService.setButtonLoading('update-role-button', true);
     this.getCompanyId();
    this.rolesUseCase.update(roleDetail.id, event).subscribe({
      next: () => {
        this.handleUpdateRoleSuccess();
        this.store.dispatch(setCompanyAction({ payload: this.companyId()!.toString() }));
      },
      error: (error: HttpErrorResponse) => this.handleUpdateRoleError(error)
    });
  }

  getCompanyId() {
     this.store.select(selectCompanyId).subscribe(companyId => {
       this.companyId.set(companyId);
     });
  }

  deleteRole(role: IRoleEntity) {
    this.loadingService.startLoading('general');
    this.rolesUseCase.deleteRole(role.id).subscribe({
      next: () => this.handleDeleteRoleSuccess(),
      error: (error: HttpErrorResponse) => this.handleDeleteRoleError(error)
    });
  }

  activateRole(role: IRoleEntity) {
    this.loadingService.startLoading('general');
    this.rolesUseCase.activateRole(role.id).subscribe({
      next: () => this.handleActivateRoleSuccess(),
      error: (error: HttpErrorResponse) => this.handleActivateRoleError(error)
    });
  }

  private handleUpdateRoleSuccess(): void {
    this.toastCustomService.success('Rol actualizado correctamente');
    this.clearRoleDetail();
    this.loadRoles();
    this.rolesDumpComponent.closeEditDialog();
    this.loadingService.setButtonLoading('update-role-button', false);
  }

  private handleUpdateRoleError(error: HttpErrorResponse): void {
    this.toastCustomService.error(error.error.message || 'Error al actualizar el rol');
    this.loadingService.setButtonLoading('update-role-button', false);
  }

  private handleDeleteRoleSuccess(): void {
    this.toastCustomService.success('Rol eliminado correctamente');
    this.loadRoles();
    this.loadingService.stopLoading('general');
  }

  private handleDeleteRoleError(error: HttpErrorResponse): void {
    this.toastCustomService.error(error.error.message || 'Error al eliminar el rol');
    this.loadingService.stopLoading('general');
  }

  private handleActivateRoleSuccess(): void {
    this.toastCustomService.success('Rol activado correctamente');
    this.loadRoles();
    this.loadingService.stopLoading('general');
  }

  private handleActivateRoleError(error: HttpErrorResponse): void {
    this.toastCustomService.error(error.error.message || 'Error al activar el rol');
    this.loadingService.stopLoading('general');
  }
}
