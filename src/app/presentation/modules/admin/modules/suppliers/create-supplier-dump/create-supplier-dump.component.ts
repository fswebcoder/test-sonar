import { Component, computed, effect, inject, input, output, viewChild, signal } from '@angular/core';
import { FormBuilderService } from '../services/formBuilder.service';
import { IFormFieldCreateSupplierEntity } from '@/domain/entities/admin/suppliers/form-field-create-supplier.entity';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateSuppliersParamsEntity } from '@/domain/entities/admin/suppliers/create-suppliers-params.entity';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ACCEPT_LABEL_QUESTION_CREATE_SUPPLIER } from '@/shared/constants/general.contant';
import { FormSkeletonComponent } from '../components/form-skeleton/form-skeleton.component';
import { FormSupplierComponent } from '../form-supplier/form-supplier.component';

@Component({
  selector: 'svi-create-supplier-dump',
  imports: [
    ReactiveFormsModule, 
    FormSkeletonComponent,
    FormSupplierComponent,
  ],
  templateUrl: './create-supplier-dump.component.html',
  styleUrl: './create-supplier-dump.component.scss'
})
export class CreateSupplierDumpComponent {
  
  formFieldsInput = input<IFormFieldCreateSupplierEntity[]>([]);
  initialDataInput = input<Record<string, any>>({});
  private readonly formBuilderService = inject(FormBuilderService);
  private readonly fb = inject(FormBuilder);

  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  supplierForm: FormGroup;

  createSupplierOutput = output<ICreateSuppliersParamsEntity>();
  closeDialogOutput = output<void>();
  constructor() {
    this.supplierForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  createSupplier(params: ICreateSuppliersParamsEntity): void {
    this.createSupplierOutput.emit(params);
  }

  closeDialog(): void {
    console.log('closeDialog create supplier dump');
    this.closeDialogOutput.emit();
  }


}
