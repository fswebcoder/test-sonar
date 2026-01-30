import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { DatePikerComponent } from '@/shared/components/form/date-piker/date-piker.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';
import { ISupplierOrderEntity } from '@/domain/entities/suppliers/admin/weighing-orders/supplier-order.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { IMaterialTypeCatalogEntity } from '@/domain/entities/common/material-type-catalog.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';

@Component({
  selector: 'svi-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatInputComponent,
    FloatSelectComponent,
    DatePikerComponent,
    ButtonComponent,
    FileInputComponent
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent {
  order = input.required<ISupplierOrderEntity>();
  mines = input.required<IMineEntity[]>();
  materialTypes = input.required<IMaterialTypeCatalogEntity[]>();

  updateOrder = output<IUpdateSupplierOrderParamsEntity>();
  cancelForm = output<void>();

  readonly ICONS = ICONS;
  readonly LOADING = MINERAL_SEND_LOADING;
  readonly EWeightUnits = EWeightUnits

  form = new FormGroup({
    mineId: new FormControl<string | null>(null, [Validators.required]),
    materialTypeId: new FormControl<string | null>(null, [Validators.required]),
    supplierBatchName: new FormControl<string | null>(null),
    sendedWeight: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.001),
      Validators.max(9999999.999)
    ]),
    estimatedShippingDateTime: new FormControl<Date | null>(null, [Validators.required]),
    internalRemissionDocument: new FormControl<File | null>(null)
  });

  minDate = new Date();

  readonly syncEffect$ = effect(() => {
    const order = this.order();
    if (order) {
      this.form.patchValue({
        mineId: order.mine?.id ?? null,
        materialTypeId: order.materialType.id,
        supplierBatchName: order.supplierBatchName ?? null,
        sendedWeight: order.sendedWeight ? Number.parseFloat(order.sendedWeight) : null,
        estimatedShippingDateTime: order.estimatedShippingDateTime 
          ? new Date(order.estimatedShippingDateTime) 
          : null
      });
    }
  });

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const params: IUpdateSupplierOrderParamsEntity = {
      id: this.order().id,
      mineId: formValue.mineId ?? undefined,
      materialTypeId: formValue.materialTypeId ?? undefined,
      supplierBatchName: formValue.supplierBatchName,
      sendedWeight: formValue.sendedWeight ?? undefined,
      estimatedShippingDateTime: formValue.estimatedShippingDateTime ?? undefined,
      internalRemissionDocument: formValue.internalRemissionDocument ?? undefined
    };

    this.updateOrder.emit(params);
  }

  cancel(): void {
    this.cancelForm.emit();
  }

  resetForm(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
