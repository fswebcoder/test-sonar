import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSupplierSmartComponent } from '../create-supplier-smart/create-supplier-smart.component';
import { ViewSupplierComponent } from '../components/view-supplier/view-supplier.component';
import { ICreateSuppliersParamsEntity } from '@/domain/entities/admin/suppliers/create-suppliers-params.entity';
import { EditSupplierSmartComponent } from '../edit-supplier-smart/edit-supplier-smart.component';

@Component({
  selector: 'svi-management-supplier',
  imports: [
    CommonModule, CreateSupplierSmartComponent, EditSupplierSmartComponent, ViewSupplierComponent
  ],
  templateUrl: './management-supplier.component.html',
  styleUrl: './management-supplier.component.scss'
})
export class ManagementSupplierComponent {
   viewMode = input<string>('create');
   initialDataInput = input<Record<string, any>>({});
   dataForEdit = input<Record<string, any>>({});
   supplierToEdit = input<any>(null);
   closeDialogOutput = output<void>();  
   getSupplier = output<void>();
   supplierId = input<string>('');  
   editSupplierOutput = output<ICreateSuppliersParamsEntity>();
   
   closeDialog(): void {
    this.closeDialogOutput.emit();
   }

    editSupplier(params: ICreateSuppliersParamsEntity | any): void {
      this.editSupplierOutput.emit(params);
    }

    handleGetSupplier(): void {
      this.getSupplier.emit();
    }
}
