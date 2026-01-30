import { ICreateSuppliersParamsEntity } from '@/domain/entities/admin/suppliers/create-suppliers-params.entity';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilderService } from '../services/formBuilder.service';
import { CommonModule } from '@angular/common';
import { FormSupplierComponent } from '../form-supplier/form-supplier.component';

@Component({
  selector: 'svi-edit-supplier-dump',
  imports: [CommonModule, FormSupplierComponent],
  templateUrl: './edit-supplier-dump.component.html',
  styleUrl: './edit-supplier-dump.component.scss'
})
export class EditSupplierDumpComponent {
  private  readonly formBuilderService = inject(FormBuilderService);
  supplierToEdit = input<any>(null);
  editSupplierOutput = output<ICreateSuppliersParamsEntity>();
  closeDialogOutput = output<void>();
  editSupplier(params: ICreateSuppliersParamsEntity): void {
    this.editSupplierOutput.emit(params);
  }

  closeDialog(): void {
    this.closeDialogOutput.emit();
  }
}
