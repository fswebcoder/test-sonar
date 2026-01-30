import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { IUserEntity } from '@/domain/entities/admin/users/user.entity';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';
import { IRoleCatalogResponseEntity } from '@/domain/entities/admin/roles/role-catalog-response.entity';
import { ICreateUsersParamsEntity } from '@/domain/entities/admin/users/create-users-params.entity';
import { IUpdateUsersParamsEntity } from '@/domain/entities/admin/users/update-users-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FormCreateEditService } from '@/presentation/modules/admin/modules/users/services/form-create-edit.service';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-user-form',
  imports: [
    ReactiveFormsModule,
    FloatInputComponent,
    FloatSelectComponent,
    ButtonComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  user = input.required<IUserEntity | null>();
  action = input.required<'create' | 'edit' | 'view'>();
  documentTypes = input.required<IDocumentTypeResponse[]>();
  roles = input.required<IRoleCatalogResponseEntity[]>();
  formBuilderService = inject(FormCreateEditService);
  
  isFormReady = signal<boolean>(false);
  
  form = this.formBuilderService.buildForm();
  ICONS = ICONS

  onCreate = output<ICreateUsersParamsEntity>();
  onUpdate = output<IUpdateUsersParamsEntity>();
  onCancel = output<void>();

  syncEffect$ = effect(() => {
    const userData = this.user();
    const currentAction = this.action();
    
    this.isFormReady.set(false);
    
    this.formBuilderService.buildForm(userData);
    
    if (currentAction === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }
    
    this.isFormReady.set(true);
  });

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, ...formValue } = this.form.value;
    return this.action() === 'create' ? this.onCreate.emit({ ...formValue, password }) : this.onUpdate.emit(formValue);
  }

  onCancelForm(): void {
    this.formBuilderService.resetForm();
    this.onCancel.emit();
  }

  resetForm(): void {
    this.formBuilderService.resetForm();
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
  
}
