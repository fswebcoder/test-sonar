import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMaterialTypeEntity } from '@/domain/entities/scale/material-types/material-type.entity';

@Injectable({
  providedIn: 'root'
})
export class MaterialTypeFormService {
  private readonly formBuilder = inject(FormBuilder);
  private formGroup!: FormGroup;

  constructor() {
    this.initializeForm();
    this.formGroup.markAllAsTouched();
  }

  private initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]]
    });
  }

  buildForm(materialType?: IMaterialTypeEntity | null): FormGroup {
    if (!this.formGroup) {
      this.initializeForm();
    }

    if (materialType) {
      this.formGroup.patchValue({
        name: materialType.name ?? ''
      });
    } else {
      this.formGroup.reset();
    }

    return this.formGroup;
  }

  resetForm(): void {
    this.formGroup.reset();
  }
}
