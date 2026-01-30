import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { IUpdateObserverParamsEntity } from '@/domain/entities/scale/observers/update-observer-params.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';

@Component({
  selector: 'svi-observer-documents-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileInputComponent, ButtonComponent],
  templateUrl: './observer-documents-form.component.html'
})
export class ObserverDocumentsFormComponent {
  private readonly destroyRef = inject(DestroyRef);

  observer = input.required<IObserverEntity>();

  dismiss = output<void>();
  documentsSubmit = output<Pick<IUpdateObserverParamsEntity, 'id' | 'documents'>>();

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
    const observer = this.observer();
    const { cc, arl } = this.form.getRawValue();

    const hasFiles = cc instanceof File || arl instanceof File;
    if (!hasFiles) return;

    this.documentsSubmit.emit({
      id: observer.id,
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
