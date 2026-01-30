import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { MaterialTypeFormService } from '@/presentation/modules/scale/modules/material-types/services/material-type-form.service';
import { IMaterialTypeEntity } from '@/domain/entities/scale/material-types/material-type.entity';
import { ICreateMaterialTypeParamsEntity } from '@/domain/entities/scale/material-types/create-material-type-params.entity';
import { IUpdateMaterialTypeParamsEntity } from '@/domain/entities/scale/material-types/update-material-type-params.entity';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-material-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, FloatInputComponent, ButtonComponent],
  templateUrl: './material-type-form.component.html',
  styleUrl: './material-type-form.component.scss'
})
export class MaterialTypeFormComponent {
  materialType = input.required<IMaterialTypeEntity | null>();
  action = input.required<'create' | 'edit' | 'view'>();

  private readonly formService = inject(MaterialTypeFormService);

  form = this.formService.buildForm();
  isFormReady = signal<boolean>(false);
  readonly ICONS = ICONS;

  onCreate = output<ICreateMaterialTypeParamsEntity>();
  onUpdate = output<IUpdateMaterialTypeParamsEntity>();
  onCancel = output<void>();

  syncEffect$ = effect(() => {
    const materialType = this.materialType();
    const currentAction = this.action();

    this.isFormReady.set(false);
    this.form = this.formService.buildForm(materialType);

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

    if (this.action() === 'create') {
      this.onCreate.emit(this.form.value as ICreateMaterialTypeParamsEntity);
      return;
    }

    const materialTypeId = this.materialType()?.id ?? '';
    this.onUpdate.emit({ id: materialTypeId, ...this.form.value });
  }

  onCancelForm(): void {
    this.formService.resetForm();
    this.onCancel.emit();
  }

  resetForm(): void {
    this.formService.resetForm();
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
