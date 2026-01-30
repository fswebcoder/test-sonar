import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SuppliersListDumpComponent } from '../suppliers-list-dump/suppliers-list-dump.component';
import { catchError, EMPTY, finalize, lastValueFrom, tap } from 'rxjs';
import { PaginationService } from '@/shared/services/pagination.service';
import { PaginatedData, PaginationMetadata, ToastCustomService, TPaginationParams } from '@SV-Development/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ISuppliersEntity } from '@/domain/entities/admin/suppliers/suppliers.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { SuppliersUseCase } from '@/domain/use-cases/admin/suppliers/suppliers.usecase';
import { ERROR_OPERATION_TITLE, LOAD_DATA_ERROR_TITLE } from '@/shared/constants/general.contant';
import { idSupplierAction } from '@/store/actions/admin/suppliers/suppliers.actions';
import { Store } from '@ngrx/store';
import { selectCommonDocumentTypes } from '@/store/selectors/common/common.selectors';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { ICreateSupplierAdminUserParamsEntity } from '@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity';

@Component({
  selector: 'svi-suppliers-list-smart',
  imports: [SuppliersListDumpComponent],
  templateUrl: './suppliers-list-smart.component.html',
  styleUrl: './suppliers-list-smart.component.scss'
})
export class SuppliersListSmartComponent implements OnInit {
  private readonly suppliersUseCase = inject(SuppliersUseCase);
  private readonly paginationService = inject(PaginationService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  store = inject(Store);
  private params = signal<TPaginationParams>(this.paginationService.getPaginationParams() as TPaginationParams);

  supplierToEdit = signal<any>(null);
  supplierIdToEdit = signal<string>('');
  supplierId = signal<string>('');
  documentTypes = signal<IDocumentTypeResponse[]>([]);

  @ViewChild(SuppliersListDumpComponent) suppliersListDumpComponent!: SuppliersListDumpComponent;
  
  constructor() {
  }

  ngOnInit(): void {
    this.store.select(selectCommonDocumentTypes).subscribe(documentTypes => {
      this.documentTypes.set(documentTypes);
    });
    this.suppliersQuery.refetch();
  }

  suppliersQueryData = computed(() => {
    const queryData = this.suppliersQuery.data();
    return this.processSuppliersQueryData(queryData);
  });

  suppliersItems = computed(() => {
    const data = this.suppliersQueryData();
    return data?.items || [];
  });

  private processSuppliersQueryData(data: PaginatedData<ISuppliersEntity> | undefined): PaginatedData<ISuppliersEntity> {
    return data || {
      items: [],
      meta: this.paginationService.getPaginationParams() as PaginationMetadata
    };
  }

  suppliersMeta = computed(() => {
    const data = this.suppliersQueryData();
    return data?.meta || this.paginationService.getPaginationParams() as TPaginationParams;
  });

  private handleQueryError(error: HttpErrorResponse): void {
    this.toastCustomService.error('Error', LOAD_DATA_ERROR_TITLE);
  }

  private readonly suppliersQuery = injectQuery(() => ({
    queryKey: ['suppliers', this.params()],
    queryFn: () => this.fetchSuppliers(),
    onError: (error: HttpErrorResponse) => this.handleQueryError(error),
    enabled: true
  }));

  private async fetchSuppliers(): Promise<PaginatedData<ISuppliersEntity> | undefined> {
    this.loadingService.startLoading('general');
    try {
      const currentParams = this.params();
      const response = await lastValueFrom(this.suppliersUseCase.getAllByFilter(currentParams));
      
      if (response.data?.meta?.total !== undefined) {
        this.paginationService.setTotalRecords(response.data.meta.total);
      }
      
      return response.data;
    } catch (error) {
        console.log(error)
      return undefined;
    } finally {
      this.loadingService.stopLoading('general');
    }
  }

  paramsChange(params: TPaginationParams): void {
    this.params.set(params);
  }

  refreshSuppliers(): void {
    this.suppliersQuery.refetch();
  }

  getSupplierById(supplierId: string): void {
    this.loadingService.startLoading('general');
    this.supplierIdToEdit.set(supplierId);
    this.store.dispatch(idSupplierAction({ payload: supplierId }));
    this.suppliersUseCase.getById(supplierId).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.supplierToEdit.set(response.data);
          this.loadingService.stopLoading('general');
        }
      },
      error: (error) => {
        this.toastCustomService.error('Error', 'No se pudieron obtener los datos del proveedor');
      }
    });
  }

  deleteSupplier(supplierId: string): void {
    this.suppliersUseCase.delete(supplierId).subscribe({
      next: (response) => {
        this.toastCustomService.success('Éxito', response.message);
        this.refreshSuppliers();
      }
    });
  }

  activateSupplier(supplierId: string): void {  
    this.suppliersUseCase.activate(supplierId).subscribe({
      next: (response) => {
        this.toastCustomService.success('Éxito', response.message);
        this.refreshSuppliers();
      }
    });
  }

  createSupplierAdminUser(payload: ICreateSupplierAdminUserParamsEntity): void {
    this.loadingService.setButtonLoading('modal-supplier-user-button', true);
    this.suppliersUseCase
      .createSupplierAdminUser(payload)
      .pipe(
        tap((response) => {
          this.toastCustomService.success('Éxito', response.message);
          this.suppliersListDumpComponent?.closeSupplierUserDialog();
        }),
        catchError((error:HttpErrorResponse) => {
          this.toastCustomService.error('Error', error.error.message || ERROR_OPERATION_TITLE);
          return EMPTY;
        }),
        finalize(() => this.loadingService.setButtonLoading('modal-supplier-user-button', false)),
      )
      .subscribe();
  }

}
