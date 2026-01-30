import { IFormFieldCreateSupplierEntity } from '@/domain/entities/admin/suppliers/form-field-create-supplier.entity';
import { Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  private readonly _formSchema = signal<IFormFieldCreateSupplierEntity[]>([]);
  private readonly _formGroup = signal<FormGroup>(new FormGroup({}));

  readonly formSchema = this._formSchema.asReadonly();
  readonly formGroup = this._formGroup.asReadonly();

  buildFormFromFields(fields: IFormFieldCreateSupplierEntity[], initialData?: Record<string, any>): FormGroup {
    const controls: { [key: string]: FormControl } = {};
    const processedFields = this.processFormFields(fields);
    processedFields.forEach(field => {
      const validators = this.buildValidators(field);
      const initialValue = this.getInitialValue(field, initialData);
      controls[field.name] = new FormControl(initialValue, validators);
    });
    const formGroup = new FormGroup(controls);
    this._formGroup.set(formGroup);
    this._formSchema.set(processedFields);

    return formGroup;
  }


  populateFormWithData(data: Record<string, any>): void {
    if (!this._formGroup()) {
      return;
    }

    // Temporalmente habilitar el formulario para poder establecer valores
    const wasDisabled = this._formGroup().disabled;
    if (wasDisabled) {
      this._formGroup().enable();
    }

    Object.keys(data).forEach(key => {
      const control = this._formGroup().get(key);
      if (control) {
        control.setValue(data[key]);
      } 
    });

    // Restaurar el estado disabled si estaba deshabilitado
    if (wasDisabled) {
      this._formGroup().disable();
    }
  }


  updateFormWithFields(fields: IFormFieldCreateSupplierEntity[], initialData?: Record<string, any>): void {
    this.buildFormFromFields(fields, initialData);
  }

  private processFormFields(fields: IFormFieldCreateSupplierEntity[]): IFormFieldCreateSupplierEntity[] {
    const fieldsMap = new Map<string, IFormFieldCreateSupplierEntity>();

    fields.forEach(field => {
      const existingField = fieldsMap.get(field.name);
      if (
        !existingField ||
        (field.options && field.options.length > 0 && (!existingField.options || existingField.options.length === 0))
      ) {
        fieldsMap.set(field.name, field);
      }
    });

    return Array.from(fieldsMap.values());
  }

  private buildValidators(field: IFormFieldCreateSupplierEntity): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    switch (field.type) {
      case 'email':
        validators.push(Validators.email);
        break;
      case 'number':
        validators.push(Validators.pattern(/^\d*\.?\d+$/));
        break;
      case 'text':
        if (field.name === 'documentNumber') {
          validators.push(Validators.minLength(6));
        }
        break;
      case 'textarea':
        validators.push(Validators.maxLength(500));
        break;
    }

    return validators;
  }

  private getInitialValue(field: IFormFieldCreateSupplierEntity, initialData?: Record<string, any>): any {
    if (initialData && initialData.hasOwnProperty(field.name)) {
      return initialData[field.name];
    }

    if (field.value !== null && field.value !== undefined && field.value !== '') {
      return field.value;
    }

    switch (field.type) {
      case 'number':
        return null;
      case 'checkbox':
        return false;
      case 'select':
        return field.options && field.options.length > 0 ? null : '';
      case 'date':
        return null;
      default:
        return '';
    }
  }

  resetForm(): void {
    this._formGroup().reset();
  }

  getFieldValue(fieldName: string): any {
    return this._formGroup().get(fieldName)?.value;
  }

  setFieldValue(fieldName: string, value: any): void {
    this._formGroup().get(fieldName)?.setValue(value);
  }

  validateForm(): boolean {
    this._formGroup().markAllAsTouched();
    return this._formGroup().valid;
  }

  getFormData(): any {
    return this._formGroup().value;
  }

  isFormValid(): boolean {
    return this._formGroup().valid;
  }

  disableForm(): void {
    this._formGroup().disable();
  }

  enableForm(): void {
    this._formGroup().enable();
  }

  setFormDisabled(disabled: boolean): void {
    console.log('setFormDisabled llamado con:', disabled);
    if (disabled) {
      this._formGroup().disable();
    } else {
      this._formGroup().enable();
    }
  }
}
