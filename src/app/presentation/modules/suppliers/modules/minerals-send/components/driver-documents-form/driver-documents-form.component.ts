import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { IUpdateDriverParamsEntity } from '@/domain/entities/scale/drivers/update-driver-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';

@Component({
  selector: 'svi-driver-documents-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileInputComponent, ButtonComponent],
  templateUrl: './driver-documents-form.component.html'
})
export class DriverDocumentsFormComponent {
  private readonly destroyRef = inject(DestroyRef);

  driver = input.required<IDriverEntity>();

  dismiss = output<void>();
  documentsSubmit = output<Pick<IUpdateDriverParamsEntity, 'id' | 'documents'>>();

  readonly LOADING = MINERAL_SEND_LOADING;

  readonly form = new FormGroup({
    cc: new FormControl<File | null>(null),
    arl: new FormControl<File | null>(null)
  });

  readonly canSubmit = signal(false);

  constructor() {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const { cc, arl } = this.form.getRawValue();
        this.canSubmit.set(cc instanceof File || arl instanceof File);
      });
  }

  submit(): void {
    const driver = this.driver();
    const { cc, arl } = this.form.getRawValue();

    const hasFiles = cc instanceof File || arl instanceof File;
    if (!hasFiles) return;

    this.documentsSubmit.emit({
      id: driver.id,
      documents: {
        cc: cc instanceof File ? cc : undefined,
        arl: arl instanceof File ? arl : undefined
      }
    });
  }

  resetForm(): void {
    this.form.reset();
  }
}
