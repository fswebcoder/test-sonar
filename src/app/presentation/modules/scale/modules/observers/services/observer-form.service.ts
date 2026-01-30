import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ObserverFormService {
  private readonly formBuilder = inject(FormBuilder);
  private formGroup!: FormGroup;

  constructor() {
    this.initializeForm();
    this.formGroup.markAllAsTouched();
  }

  private initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      documentNumber: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[0-9]+$/)]
      ],
      documentTypeId: ['', [Validators.required]],
      cc: [null],
      arl: [null]
    });
  }

  buildForm(observer?: IObserverEntity | null): FormGroup {
    if (!this.formGroup) {
      this.initializeForm();
    }

    if (observer) {
      this.formGroup.patchValue({
        name: observer.name ?? '',
        documentNumber: observer.documentNumber ?? '',
        documentTypeId: observer.documentType?.id ?? ''
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
