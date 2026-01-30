import { ICreateSupplierAdminUserParamsEntity } from '@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'svi-supplier-admin-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, FloatInputComponent, FloatSelectComponent, ButtonComponent],
  templateUrl: './supplier-admin-user-form.component.html',
  styleUrl: './supplier-admin-user-form.component.scss'
})
export class SupplierAdminUserFormComponent {
  private readonly fb = inject(FormBuilder);

  supplierId = input.required<string>();
  supplierName = input<string>('');
  documentTypes = input.required<IDocumentTypeResponse[]>();

  onCreate = output<ICreateSupplierAdminUserParamsEntity>();
  onCancel = output<void>();

  ICONS = ICONS;

  form = this.fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    documentTypeId: ['', [Validators.required]],
    documentNumber: ['', [Validators.required]]
  });

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    this.onCreate.emit({
      name: formValue.name || '',
      lastName: formValue.lastName || '',
      email: formValue.email || '',
      documentTypeId: formValue.documentTypeId || '',
      documentNumber: formValue.documentNumber || '',
      tenantSupplierId: this.supplierId()
    });
  }

  cancel(): void {
    this.form.reset();
    this.onCancel.emit();
  }
}
