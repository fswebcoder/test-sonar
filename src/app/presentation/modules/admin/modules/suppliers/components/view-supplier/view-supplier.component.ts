import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSupplierComponent } from '../../form-supplier/form-supplier.component';

@Component({
  selector: 'svi-view-supplier',
  imports: [CommonModule, FormSupplierComponent],
  templateUrl: './view-supplier.component.html',
  styleUrl: './view-supplier.component.scss'
})
export class ViewSupplierComponent {
  supplierToEdit = input<any>(null);
  closeDialogOutput = output<void>();

  closeDialog(): void {
    this.closeDialogOutput.emit();
  }
}
