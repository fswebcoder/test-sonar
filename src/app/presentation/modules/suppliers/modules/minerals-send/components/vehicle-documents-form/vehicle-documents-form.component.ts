import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { IUpdateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/update-vehicle-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';

@Component({
  selector: 'svi-vehicle-documents-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileInputComponent, ButtonComponent],
  templateUrl: './vehicle-documents-form.component.html'
})
export class VehicleDocumentsFormComponent {
  private readonly destroyRef = inject(DestroyRef);

  vehicle = input.required<IVehicle>();

  dismiss = output<void>();
  documentsSubmit = output<Pick<IUpdateVehicleParamsEntity, 'id' | 'documents'>>();

  readonly LOADING = MINERAL_SEND_LOADING;

  readonly form = new FormGroup({
    soat: new FormControl<File | null>(null),
    technomechanical: new FormControl<File | null>(null),
    registration: new FormControl<File | null>(null)
  });

  readonly canSubmit = signal(false);

  constructor() {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const { soat, technomechanical, registration } = this.form.getRawValue();
        this.canSubmit.set(
          soat instanceof File || technomechanical instanceof File || registration instanceof File
        );
      });
  }

  submit(): void {
    const vehicle = this.vehicle();
    const { soat, technomechanical, registration } = this.form.getRawValue();

    const hasFiles = soat instanceof File || technomechanical instanceof File || registration instanceof File;
    if (!hasFiles) return;

    this.documentsSubmit.emit({
      id: vehicle.id,
      documents: {
        soat: soat instanceof File ? soat : undefined,
        technomechanical: technomechanical instanceof File ? technomechanical : undefined,
        registration: registration instanceof File ? registration : undefined
      }
    });
  }

  resetForm(): void {
    this.form.reset();
  }
}
