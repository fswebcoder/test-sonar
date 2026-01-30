import { Injectable, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";

@Injectable({
  providedIn: "root"
})
export class OrderFormService {
  private readonly formBuilder = inject(FormBuilder);
  private formGroup!: FormGroup;
  private batchValidationEnabled = true;

  constructor() {
    this.initializeForm();
  }

  buildForm(): FormGroup {
    if (!this.formGroup) {
      this.initializeForm();
    }

    return this.formGroup;
  }

  resetForm(): void {
    this.formGroup.reset();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.formGroup.get("batchId")?.disable({ emitEvent: false });
    this.formGroup.get("originStorageZoneId")?.disable({ emitEvent: false });
    this.formGroup.get("batchName")?.enable({ emitEvent: false });
    this.setBatchValidationEnabled(true);
  }

  getFormValue(): ICreateOrderParamsEntity {
    const {
      destinationStorageZoneId,
      originStorageZoneId,
      supplierId,
      mineId,
      batchId,
      batchName,
      operationTypeWeightRegister,
      estimatedShippingDateTime,
      internalRemissionDocument,
      ...rest
    } = this.formGroup.getRawValue();

    const isMovement = operationTypeWeightRegister === EOrderScaleType.MOVEMENT;

    return {
      ...rest,
      operationTypeWeightRegister,
      destinationStorageZoneId: destinationStorageZoneId || undefined,
      originStorageZoneId: originStorageZoneId || undefined,
      supplierId: supplierId || undefined,
      mineId: mineId || undefined,
      batchId: this.batchValidationEnabled ? batchId || null : undefined,
      batchName: !isMovement && this.batchValidationEnabled ? batchName || null : undefined,
      estimatedShippingDateTime: estimatedShippingDateTime || null,
      internalRemissionDocument: internalRemissionDocument || null
    };
  }

  private initializeForm(): void {
    this.formGroup = this.formBuilder.group(
      {
        destinationStorageZoneId: ["", Validators.required],
        originStorageZoneId: [null],
        driverId: ["", Validators.required],
        materialTypeId: ["", Validators.required],
        operationTypeWeightRegister: [null, Validators.required],
        supplierId: ["", Validators.required],
        mineId: [null],
        vehicleId: ["", Validators.required],
        batchId: [null],
        batchName: [null],
        estimatedShippingDateTime: [null, Validators.required],
        internalRemissionDocument: [null]
      },
      { validators: this.batchFieldValidator }
    );

    this.formGroup.get("batchId")?.disable({ emitEvent: false });
    this.formGroup.get("originStorageZoneId")?.disable({ emitEvent: false });
    this.batchValidationEnabled = true;
  }

  private readonly batchFieldValidator = (control: AbstractControl): ValidationErrors | null => {
    const batchId = control.get("batchId")?.value;
    const batchName = control.get("batchName")?.value;
    const supplierId = control.get("supplierId")?.value;
    const mineId = control.get("mineId")?.value;
    const operationType = control.get("operationTypeWeightRegister")?.value as EOrderScaleType | null;

    const isMovement = operationType === EOrderScaleType.MOVEMENT;

    if (isMovement && batchName) {
      return { batchNameNotAllowed: true };
    }

    if (batchId && (!supplierId || !mineId)) {
      return { batchMissingData: true };
    }

    if (!isMovement && batchId && batchName) {
      return { batchConflict: true };
    }

    if (supplierId && mineId && !batchId && (isMovement || !batchName)) {
      return { batchMissing: true };
    }

    return null;
  };

  setBatchValidationEnabled(enabled: boolean): void {
    this.batchValidationEnabled = enabled;
    if (enabled) {
      this.formGroup.setValidators(this.batchFieldValidator);
    } else {
      this.formGroup.clearValidators();
    }
    this.formGroup.updateValueAndValidity({ emitEvent: false });
  }
}
