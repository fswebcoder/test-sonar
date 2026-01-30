import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { INotificationTypeEntity, ISupplierContactEntity, ICreateNotificationConfigParamsEntity } from '@/domain/entities/suppliers/notifications';

@Component({
  selector: 'svi-notification-config-form',
  imports: [ReactiveFormsModule, FloatSelectComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 p-4">
      <svi-float-select 
        formControlName="supplierContactId"
        [options]="contactOptions()"
        optionLabel="label"
        optionValue="value"
        label="Contacto"
        [showClear]="true"
      ></svi-float-select>
      
      <svi-float-select 
        formControlName="notificationTypeId"
        [options]="notificationTypeOptions()"
        optionLabel="label"
        optionValue="value"
        label="Tipo de Notificación"
        [showClear]="true"
      ></svi-float-select>
      
      <div class="flex justify-content-end gap-2">
        <svi-button 
          type="button" 
          severity="secondary" 
          icon="{{ ICONS.CANCEL }}" 
          (click)="cancel()" 
          label="Cancelar">
        </svi-button>
        <svi-button 
          icon="{{ ICONS.SAVE }}" 
          type="submit" 
          [disabled]="form.invalid" 
          label="Guardar">
        </svi-button>
      </div>
    </form>
  `,
})
export class NotificationConfigFormComponent {
  notificationTypes = input.required<INotificationTypeEntity[]>();
  contacts = input.required<ISupplierContactEntity[]>();

  form = new FormGroup({
    supplierContactId: new FormControl('', [Validators.required]),
    notificationTypeId: new FormControl('', [Validators.required])
  });

  createConfig = output<ICreateNotificationConfigParamsEntity>();
  cancelForm = output<void>();

  ICONS = ICONS;

  contactOptions() {
    return this.contacts().map(c => ({
      label: `${c.name} (${c.email})`,
      value: c.id
    }));
  }

  notificationTypeOptions() {
    return this.notificationTypes().map(t => ({
      label: t.name,
      value: t.id
    }));
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

    this.createConfig.emit({
      supplierContactId: formValue.supplierContactId!,
      notificationTypeId: formValue.notificationTypeId!
    });
    
    this.form.reset();
  }
}
