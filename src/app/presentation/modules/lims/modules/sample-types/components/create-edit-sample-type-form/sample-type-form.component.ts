import { ISampleTypeEntity } from '@/domain/entities/lims/sample-types/sample-type.entity';
import { Component, computed, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { ICreateSampleTypeParams } from '@/domain/entities/lims/sample-types/create-sample-type-params.entity';
import { FormMode } from '@/shared/types/form-mode.type';
import { IEditSampleTypeParams } from '@/domain/entities/lims/sample-types/edit-sample-type-params.entity';
import { CheckboxComponent } from "@/shared/components/form/checkbox/checkbox.component";

@Component({
  selector: 'svi-sample-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, FloatInputComponent, ButtonComponent, CheckboxComponent],
  template: `
    <form [formGroup]="form()" (ngSubmit)="submit()" class="flex flex-col gap-4 p-4">
      <svi-float-input formControlName="name" label="Nombre" required></svi-float-input>
      <svi-float-input formControlName="shortName" label="Nombre corto" required></svi-float-input>
      <svi-float-input formControlName="description" label="Descripción"></svi-float-input>
      <svi-checkbox formControlName="autoGenerateCode" label="Generar código automáticamente"></svi-checkbox>
      <div class="flex justify-content-end gap-2">
        <svi-button type="button" severity="secondary" icon="{{ ICONS.CANCEL }}" (click)="cancel()"
          >Cancelar</svi-button
        >
        @if (mode() !== 'view') {
          <svi-button icon="{{ ICONS.SAVE }}" type="submit" [disabled]="form().invalid" label="Guardar"></svi-button>
        }
      </div>
    </form>
  `,
  styles: [``]
})
export class SampleTypeFormComponent {
  form = computed(() => this.createForm(this.data()));

  data = input.required<ISampleTypeEntity | null>();
  mode = input.required<FormMode | null>();

  onCreate = output<ICreateSampleTypeParams>();
  onEdit = output<IEditSampleTypeParams>();
  onCancel = output<void>();

  ICONS = ICONS;


  cancel() {
    this.form().reset();
    this.onCancel.emit();
  }

  submit() {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    if (this.mode() === 'edit') {
      const data: IEditSampleTypeParams = { ...this.data(), ...this.form().value };
      this.onEdit.emit(data);
    } else if (this.mode() === 'create') {
      const { isActive, ...data } = { ...this.form().value };
      this.onCreate.emit(data);
    } else {
      console.error('Modo no soportado');
    }
  }

  private createForm(data: ISampleTypeEntity | null): FormGroup {
    const form = new FormGroup({
      name: new FormControl(data?.name || '', [Validators.required]),
      shortName: new FormControl(data?.shortName || '', [Validators.required]),
      description: new FormControl(data?.description || '', [Validators.maxLength(255)]),
      autoGenerateCode: new FormControl(data?.autoGenerateCode ?? false, [Validators.required]),
      isActive: new FormControl(data?.isActive ?? true, [Validators.required])
    });
    if (this.mode() === 'view') {
      form.disable();
    }
    return form;
  }
}
