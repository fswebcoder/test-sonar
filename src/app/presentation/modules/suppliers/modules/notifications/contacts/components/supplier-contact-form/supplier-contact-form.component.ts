import { Component, input, output, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { FormMode } from '@/shared/types/form-mode.type';
import { ISupplierContactEntity, ICreateSupplierContactParamsEntity, IUpdateSupplierContactParamsEntity } from '@/domain/entities/suppliers/notifications';

@Component({
  selector: 'svi-supplier-contact-form',
  imports: [ReactiveFormsModule, FloatInputComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 p-4">
      <svi-float-input 
        formControlName="name" 
        label="Nombre" 
        [required]="mode() !== 'view'"
        [disabled]="mode() === 'view'"
      ></svi-float-input>
      
      <svi-float-input 
        formControlName="email" 
        label="Correo electrónico" 
        type="email"
        [required]="mode() !== 'view'"
        [disabled]="mode() === 'view'"
      ></svi-float-input>
      
      <svi-float-input 
        formControlName="position" 
        label="Cargo" 
        [disabled]="mode() === 'view'"
      ></svi-float-input>
      
      <svi-float-input 
        formControlName="phone" 
        label="Teléfono" 
        [disabled]="mode() === 'view'"
      ></svi-float-input>
      
      <div class="flex justify-content-end gap-2">
        <svi-button 
          type="button" 
          severity="secondary" 
          icon="{{ ICONS.CANCEL }}" 
          (click)="cancel()" 
          [label]="mode() === 'view' ? 'Cerrar' : 'Cancelar'">
        </svi-button>
        @if (mode() !== 'view') {
          <svi-button 
            icon="{{ ICONS.SAVE }}" 
            type="submit" 
            [disabled]="form.invalid" 
            label="Guardar">
          </svi-button>
        }
      </div>
    </form>
  `,
})
export class SupplierContactFormComponent {
  mode = input<FormMode>('create');
  contact = input<ISupplierContactEntity | null>(null);

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    position: new FormControl(''),
    phone: new FormControl('')
  });

  contactCreated = output<ICreateSupplierContactParamsEntity>();
  contactEdited = output<IUpdateSupplierContactParamsEntity>();
  cancelForm = output<void>();

  ICONS = ICONS;

  constructor() {
    effect(() => {
      const contactData = this.contact();
      if (contactData) {
        this.form.patchValue({
          name: contactData.name,
          email: contactData.email,
          position: contactData.position || '',
          phone: contactData.phone || ''
        });
      } else {
        this.form.reset();
      }
    });
  }

  cancel(): void {
    this.form.reset();
    this.cancelForm.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const currentMode = this.mode();
    const contactData = this.contact();

    const params = {
      name: formValue.name!,
      email: formValue.email!,
      position: formValue.position || undefined,
      phone: formValue.phone || undefined
    };

    if (currentMode === 'edit' && contactData) {
      this.contactEdited.emit({ id: contactData.id, ...params });
    } else {
      this.contactCreated.emit(params);
    }
    
    this.form.reset();
  }
}
