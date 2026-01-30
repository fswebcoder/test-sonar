import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit, output, signal, viewChild, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilderService } from '../services/formBuilder.service';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { IFormFieldCreateSupplierEntity } from '@/domain/entities/admin/suppliers/form-field-create-supplier.entity';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ACCEPT_LABEL_QUESTION_CREATE_SUPPLIER } from '@/shared/constants/general.contant';
import { ICreateSuppliersParamsEntity } from '@/domain/entities/admin/suppliers/create-suppliers-params.entity';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Component({
  selector: 'svi-form-supplier',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatInputComponent,
    FloatSelectComponent,
    ButtonComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './form-supplier.component.html',
  styleUrl: './form-supplier.component.scss'
})
export class FormSupplierComponent implements OnInit {
  viewChildDialog = viewChild<ConfirmDialogComponent>('confirmDialog');
  formFieldsInput = input<IFormFieldCreateSupplierEntity[]>([]);
  isDisabled = input<boolean>(false);
  closeDialogOutput = output<void>();


  private destroy$ = new Subject<void>();
  store = inject(Store);

  private readonly formBuilderService = inject(FormBuilderService);
  readonly formGroup = computed(() => this.formBuilderService.formGroup());
  readonly formFields = computed(() => this.formBuilderService.formSchema());

  createSupplierOutput = output<ICreateSuppliersParamsEntity>();

  ngOnInit(): void {
   }

    constructor(){
    effect(() => {
      const currentSchema = this.formFieldsInput();
      if (currentSchema && Array.isArray(currentSchema) && currentSchema.length > 0) {
        this.formBuilderService.buildFormFromFields(currentSchema);
        if (this.isDisabled()) {
          this.formBuilderService.setFormDisabled(true);
          this.formBuilderService.formGroup().markAllAsTouched();

        } else {
          this.formBuilderService.setFormDisabled(false);
          this.formBuilderService.formGroup().markAllAsTouched();

        }
      }
    });
  }

  validateForm(){
    if(this.isFormValid()){
      this.confirmationDialog();
    }
    return null;
  }

  confirmationDialog(){
    this.viewChildDialog()?.show(
      ACCEPT_LABEL_QUESTION_CREATE_SUPPLIER,
      () => {
        const params = this.createParamsSupplier();
        this.createSupplierOutput.emit(params);

        this.formBuilderService.resetForm();
      },
      () => {}
    );
  }

  createParamsSupplier(){
    const formValue = this.formGroup()?.value || {};
    const params: ICreateSuppliersParamsEntity = {};

    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '') {
        params[key] = value.toString();
      }
    });

    return params;
  }

  public isFormValid(): boolean {
    return this.formBuilderService.isFormValid();
  }

  closeDialog(){
    this.formBuilderService.resetForm();
    this.closeDialogOutput.emit();
  }
}
