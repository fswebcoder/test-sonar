import { Component, computed, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { finalize, lastValueFrom } from 'rxjs';

import { IUserEntity } from '@/domain/entities/admin/users/user.entity';
import { ICreateUsersParamsEntity } from '@/domain/entities/admin/users/create-users-params.entity';
import { IUpdateUsersParamsEntity } from '@/domain/entities/admin/users/update-users-params.entity';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { IRoleCatalogResponseEntity } from '@/domain/entities/admin/roles/role-catalog-response.entity';
import { UsersUseCase } from '@/domain/use-cases/admin/users/users.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { PaginationService } from '@/shared/services/pagination.service';
import { LOAD_DATA_ERROR_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { selectCommonDocumentTypes, selectCommonRoles } from '@/store/selectors/common/common.selectors';
import { IGeneralResponse, PaginatedData, ToastCustomService, TPaginationParams } from '@SV-Development/utilities';

import { UsersDumpComponent } from '../users-dump/users-dump.component';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';

@Component({
  selector: 'svi-users-smart',
  imports: [UsersDumpComponent],
  templateUrl: './users-smart.component.html',
  styleUrl: './users-smart.component.scss'
})
export class UsersSmartComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly paginationService = inject(PaginationService);
  private readonly usersUseCase = inject(UsersUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  @ViewChild(UsersDumpComponent) usersDumpComponent!: UsersDumpComponent;

  documentTypes = signal<IDocumentTypeResponse[]>([]);
  roles = signal<IRoleCatalogResponseEntity[]>([]);

  ngOnInit(): void {
    this.loadInitialData();
    this.getRoleFromStore();
    this.paginationService.resetPagination();
  }

  private readonly usersQuery = injectQuery(() => ({
    queryKey: ['users', this.paginationService.getPaginationParams()],
    queryFn: () => this.fetchUsers(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true
  }));

  usersQueryData = computed(() => {
    const queryData = this.usersQuery.data();
    return this.processUsersQueryData(queryData);
  });
  createUser(user: ICreateUsersParamsEntity) {
    this.loadingService.setButtonLoading('modal-user-button', true);
    this.usersUseCase
      .create(user)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-user-button', false))
      )
      .subscribe({
        next: response => {
          this.usersDumpComponent.closeUserModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => {
          this.handleQueryError(error);
        }
      });
  }

  updateUser(user: IUpdateUsersParamsEntity) {
    this.loadingService.setButtonLoading('modal-user-button', true);
    this.usersUseCase
      .update(user)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.setButtonLoading('modal-user-button', false))
      )
      .subscribe({
        next: response => {
          this.usersDumpComponent.closeUserModal();
          this.processResponse(response);
        },
        error: (error: HttpErrorResponse) => {
          this.handleQueryError(error);
        }
      });
  }

  changeUserStatus(userId: string, status: boolean) {
    this.loadingService.setButtonLoading('modal-user-button', true);
    const request = status ? this.activateUser(userId) : this.desactivateUser(userId);
    request.add(() => this.loadingService.setButtonLoading('modal-user-button', false));
  }

  desactivateUser(userId: string) {
    return this.usersUseCase.deactivateUser(userId).subscribe({
      next: response => this.processResponse(response),
      error: (error: HttpErrorResponse) => {
        this.handleQueryError(error);
      }
    });
  }
  activateUser(userId: string) {
    return this.usersUseCase.activateUser(userId).subscribe({
      next: response => this.processResponse(response),
      error: (error: HttpErrorResponse) => {
        this.handleQueryError(error);
      }
    });
  }

  private processResponse(response: IEmptyResponse | IGeneralResponse<IEmptyResponse>) {
    this.toastCustomService.success(response.message || SUCCESS_OPERATION_TITLE);
    this.usersQuery.refetch();
  }

  private loadInitialData(): void {
    this.store.select(selectCommonDocumentTypes).subscribe(documentTypes => {
      this.documentTypes.set(documentTypes);
    });
  }

  private async fetchUsers(): Promise<PaginatedData<IUserEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.paginationService.getPaginationParams();
      const response = await lastValueFrom(this.usersUseCase.getAll(currentParams));
      if (response.data?.meta?.total !== undefined) {
        this.paginationService.setTotalRecords(response.data.meta.total);
      }
      return response.data;
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
      return undefined;
    } finally {
      this.loadingService.stopLoading('general');
    }
  }

  private processUsersQueryData(data: PaginatedData<IUserEntity> | undefined) {
    return (
      data || {
        items: [],
        meta: this.paginationService.getPaginationParams()
      }
    );
  }

  private handleQueryError(error: HttpErrorResponse) {
    return error.status === 401 ? null : this.toastCustomService.error(error.error.message || LOAD_DATA_ERROR_TITLE);
  }

  private getRoleFromStore() {
    this.store.select(selectCommonRoles).subscribe(roles => {
      if (roles.length > 0) {
        this.roles.set(roles);
      }
    });
  }
}
