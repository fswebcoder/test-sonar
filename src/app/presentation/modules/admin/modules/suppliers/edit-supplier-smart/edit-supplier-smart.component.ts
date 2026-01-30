import { ICreateSuppliersParamsEntity } from '@/domain/entities/admin/suppliers/create-suppliers-params.entity';
import { Component, DestroyRef, inject, input, OnInit,  output, signal } from '@angular/core';
import { FormBuilderService } from '../services/formBuilder.service';
import { EditSupplierDumpComponent } from '../edit-supplier-dump/edit-supplier-dump.component';
import { omit } from 'lodash';
import { finalize } from 'rxjs';
import { SuppliersUseCase } from '@/domain/use-cases/admin/suppliers/suppliers.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { Store } from '@ngrx/store';
import { selectIdSupplier } from '@/store/selectors/admin/suppliers/suppliers.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'svi-edit-supplier-smart',
  imports: [EditSupplierDumpComponent],
  templateUrl: './edit-supplier-smart.component.html',
  styleUrl: './edit-supplier-smart.component.scss'
})
export class EditSupplierSmartComponent implements OnInit  {
  private readonly destroyRef = inject(DestroyRef);
  store = inject(Store);
  private readonly suppliersUseCase = inject(SuppliersUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private  readonly formBuilderService = inject(FormBuilderService);
  supplierToEdit = input<any>(null);
  closeDialogOutput = output<void>();
   getSupplier = output<void>();
   idSupplier = signal<string>('');

   closeDialog(): void {
     this.closeDialogOutput.emit();
   }
 
   handleGetSupplier(): void {
     this.getSupplier.emit();
   }
   
 
   updateSupplier(params: ICreateSuppliersParamsEntity): void {
        this.suppliersUseCase.update(this.idSupplier(), omit(params, ['id'])).pipe(
      finalize(() => this.loadingService.stopLoading('general'))
    ).subscribe({
      next: (response) => {
        if(response.statusCode === 200){
          this.toastCustomService.success('Éxito', response.message);
          this.closeDialog();
        }
      },
      error: (error) => {
        this.toastCustomService.error('Error', error.message);
      }
    });
   
  }

  ngOnInit(): void {
    this.getSupplierId();
  }

  getSupplierId(): void {
    this.store.select(selectIdSupplier).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((idSupplier) => {
      this.idSupplier.set(idSupplier.idSupplier!);
    });
  }
 
}
