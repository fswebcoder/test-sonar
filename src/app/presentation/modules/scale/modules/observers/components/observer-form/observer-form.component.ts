import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';

import { ObserverFormService } from '@/presentation/modules/scale/modules/observers/services/observer-form.service';
import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { ICreateObserverParamsEntity } from '@/domain/entities/scale/observers/create-observer-params.entity';
import { IUpdateObserverParamsEntity } from '@/domain/entities/scale/observers/update-observer-params.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { IDocumentTypeResponse } from '@/domain/entities/common/document-response.entity';

@Component({
  selector: 'svi-observer-form',
  standalone: true,
  imports: [ReactiveFormsModule, FloatInputComponent, FloatSelectComponent, FileInputComponent, ButtonComponent],
  templateUrl: './observer-form.component.html'
})
export class ObserverFormComponent {
  observer = input.required<IObserverEntity | null>();
  action = input.required<'create' | 'edit' | 'view'>();
  documentTypes = input.required<IDocumentTypeResponse[]>();

  private readonly formService = inject(ObserverFormService);

  form = this.formService.buildForm();
  isFormReady = signal<boolean>(false);
  ICONS = ICONS;

  onCreate = output<ICreateObserverParamsEntity>();
  onUpdate = output<IUpdateObserverParamsEntity>();
  onCancel = output<void>();

  readonly syncEffect$ = effect(() => {
    const observer = this.observer();
    const currentAction = this.action();

    this.isFormReady.set(false);
    this.form = this.formService.buildForm(observer);

    if (currentAction === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }

    const canUploadDocuments = currentAction === 'create' || currentAction === 'edit';
    const documentTypeControl = this.form.get('documentTypeId');
    const ccControl = this.form.get('cc');
    const arlControl = this.form.get('arl');

    if (currentAction !== 'create') {
      documentTypeControl?.disable({ emitEvent: false });
    }

    if (canUploadDocuments) {
      ccControl?.enable({ emitEvent: false });
      arlControl?.enable({ emitEvent: false });
      ccControl?.clearValidators();
      arlControl?.clearValidators();
      ccControl?.updateValueAndValidity({ emitEvent: false });
      arlControl?.updateValueAndValidity({ emitEvent: false });
    } else {
      ccControl?.disable({ emitEvent: false });
      arlControl?.disable({ emitEvent: false });
      ccControl?.reset(null, { emitEvent: false });
      arlControl?.reset(null, { emitEvent: false });
      ccControl?.clearValidators();
      arlControl?.clearValidators();
      ccControl?.updateValueAndValidity({ emitEvent: false });
      arlControl?.updateValueAndValidity({ emitEvent: false });
    }

    this.isFormReady.set(true);
  });

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.action() === 'create') {
      const { name, documentNumber, documentTypeId, cc, arl } = this.form.getRawValue() as any;
      this.onCreate.emit({
        name,
        documentNumber,
        documentTypeId,
        cc: cc ?? undefined,
        arl: arl ?? undefined
      } as ICreateObserverParamsEntity);
      return;
    }

    const observerId = this.observer()?.id ?? '';
    const { name, documentNumber, cc, arl } = this.form.getRawValue() as any;
    const next: IUpdateObserverParamsEntity = { id: observerId, name, documentNumber };

    if (cc instanceof File || arl instanceof File) {
      next.documents = {
        cc: cc ?? undefined,
        arl: arl ?? undefined
      };
    }

    this.onUpdate.emit(next);
  }

  onCancelForm(): void {
    this.formService.resetForm();
    this.onCancel.emit();
  }

  resetForm(): void {
    this.formService.resetForm();
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
