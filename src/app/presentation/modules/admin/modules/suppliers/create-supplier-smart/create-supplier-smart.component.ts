import { IFormFieldCreateSupplierEntity } from '@/domain/entities/admin/suppliers/form-field-create-supplier.entity';
import { getFormFieldsAction } from '@/store/actions/admin/suppliers/suppliers.actions';
import { selectFormFields, selectFormFieldsLoading } from '@/store/selectors/admin/suppliers/suppliers.selectors';
import { Component, inject, input, output, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CreateSupplierDumpComponent } from '../create-supplier-dump/create-supplier-dump.component';
import { ICreateSuppliersParamsEntity } from '@/domain/entities/admin/suppliers/create-suppliers-params.entity';
import { SuppliersUseCase } from '@/domain/use-cases/admin/suppliers/suppliers.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationService } from '@/shared/services/pagination.service';

@Component({
  selector: 'svi-create-supplier-smart',
  imports: [CreateSupplierDumpComponent],
  templateUrl: './create-supplier-smart.component.html',
  styleUrl: './create-supplier-smart.component.scss'
})
export class CreateSupplierSmartComponent {
  store = inject(Store);
  private destroy$ = new Subject<void>();
  private readonly suppliersUseCase = inject(SuppliersUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly paginationService = inject(PaginationService);

  initialDataInput = input<Record<string, any>>({});
  isEditModeInput = input<boolean>(false);
  supplierIdInput = input<string>('');
  supplierToEdit = input<any>(null);
  supplierId$ = input<string>('');
  formFields$ = signal<IFormFieldCreateSupplierEntity[]>([]);
  loading$ = signal<boolean>(false);

  closeDialog = output<void>();
  outputGetSupplier = output<void>();

  ngOnInit(): void {
    this.initializeFormFields();
    this.initializeLoadingState();
    this.loadFormFields();
  }


  private initializeFormFields(): void {
    this.store.select(selectFormFields).pipe(
      takeUntil(this.destroy$)
    ).subscribe((formFields: IFormFieldCreateSupplierEntity[]) => {
      if (formFields && formFields.length > 0) {
        this.formFields$.set(formFields);
      }
    });
  }


  private initializeLoadingState(): void {
    this.store.select(selectFormFieldsLoading).pipe(
      takeUntil(this.destroy$)
    ).subscribe((loading: boolean) => {
      this.loading$.set(loading);
    });
  }

  private loadFormFields(): void {
    this.store.dispatch(getFormFieldsAction());
  }


  createSupplier(params: ICreateSuppliersParamsEntity): void {
    this.loadingService.startLoading('general');
    this.suppliersUseCase.create(params).pipe(
      finalize(() => this.loadingService.stopLoading('general'))
    ).subscribe({
      next: (response) => {
        if(response.statusCode === 201){
          this.toastCustomService.success('Éxito', response.message);
          this.outputGetSupplier.emit();
          this.closeDialog.emit();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastCustomService.error('Error', error.error.message);
      }
    });
  }

  closeDialogEmit(): void {
    console.log('closeDialogEmit create supplier smart');
    this.closeDialog.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
