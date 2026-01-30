import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VehicleFormService {
  private readonly formBuilder = inject(FormBuilder);
  private formGroup!: FormGroup;

  constructor() {
    this.initializeForm();
    this.formGroup.markAllAsTouched();
  }

  private initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      plate: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[A-Z]{3}\d{3}$/)
        ]
      ],
      vehicleTypeId: ['', Validators.required],
      soat: [null],
      technomechanical: [null],
      registration: [null]
    });
  }

  buildForm(vehicle?: IVehicle | null): FormGroup {
    if (!this.formGroup) {
      this.initializeForm();
    }

    if (vehicle) {
      this.formGroup.patchValue({
        plate: vehicle.plate ?? '',
        vehicleTypeId: vehicle.vehicleType.id ?? ''
      });

      // Do not patch file controls from URLs.
      this.formGroup.patchValue({
        soat: null,
        technomechanical: null,
        registration: null
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
