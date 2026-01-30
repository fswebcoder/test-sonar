import { Component, DestroyRef, OnInit, computed, effect, inject, input, output, signal } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { AutoCompleteComponent } from "@/shared/components/form/auto-complete/auto-complete.component";
import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { FileInputComponent } from "@/shared/components/form/file-input/file-input.component";
import { OrderFormService } from "@/presentation/modules/scale/modules/orders/services/order-form.service";
import { ICONS } from "@/shared/enums/general.enum";
import { IMaterialTypeCatalogEntity } from "@/domain/entities/common/material-type-catalog.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { distinctUntilChanged, startWith } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IDriverCatalogEntity } from "@/domain/entities/common/driver-catalog.entity";
import { IVehicleCatalogEntity } from "@/domain/entities/common/vehicle-catalog.entity";
import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";

@Component({
  selector: "svi-order-form",
  imports: [ReactiveFormsModule, FloatInputComponent, FloatSelectComponent, AutoCompleteComponent, ButtonComponent, DatePikerComponent, FileInputComponent],
  templateUrl: "./order-form.component.html",
  styleUrl: "./order-form.component.scss"
})
export class OrderFormComponent implements OnInit {
  drivers = input<IDriverCatalogEntity[]>([]);
  vehicles = input<IVehicleCatalogEntity[]>([]);
  materialTypes = input<IMaterialTypeCatalogEntity[]>([]);
  storageZones = input<IIdName[]>([]);
  mines = input<IIdName[]>([]);
  batches = input<IIdName[]>([]);
  suppliers = input<IsupplierListResponseEntity[]>([]);

  filteredVehicles = signal<IVehicleCatalogEntity[]>([]);
  batchEnabled = signal<boolean>(true);
  requiresRemissionDocument = signal<boolean>(false);

  constructor() {
    effect(() => {
      const allVehicles = this.vehicles() ?? [];
      this.filteredVehicles.set(allVehicles);
    });
  }

  private readonly formService = inject(OrderFormService);
  private readonly destroyRef = inject(DestroyRef);

  form = this.formService.buildForm();

  readonly ICONS = ICONS;
  readonly operationOptions = [
    { label: "Recepción", value: EOrderScaleType.RECEPTION },
    { label: "Movimiento", value: EOrderScaleType.MOVEMENT }
  ];

  readonly EOrderScaleType = EOrderScaleType;

  readonly isBatchConflict = computed(() => this.form.hasError("batchConflict"));
  readonly isBatchMissing = computed(() => this.form.hasError("batchMissing"));

  onCreate = output<ICreateOrderParamsEntity>();
  onCancel = output<void>();
  onSupplierChange = output<string>();
  onMineChange = output<string>();

  ngOnInit(): void {
    const supplierControl = this.form.get("supplierId");
    const mineControl = this.form.get("mineId");
    const batchControl = this.form.get("batchId");
    const batchNameControl = this.form.get("batchName");
    const operationControl = this.form.get("operationTypeWeightRegister");
    const originControl = this.form.get("originStorageZoneId");
    const materialTypeControl = this.form.get("materialTypeId");

    if (!supplierControl || !mineControl || !batchControl || !batchNameControl) {
      return;
    }

    supplierControl.valueChanges
      .pipe(
        startWith(supplierControl.value),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        mineControl.reset(null, { emitEvent: false });
        mineControl.markAsPristine();
        mineControl.markAsUntouched();

        batchControl.reset(null, { emitEvent: false });
        batchNameControl.reset(null, { emitEvent: false });
        batchNameControl.markAsPristine();
        batchNameControl.markAsUntouched();
        batchControl.markAsPristine();
        batchControl.markAsUntouched();

        if (!value) {
          this.onSupplierChange.emit("");
          this.onMineChange.emit("");
          this.updateBatchControlsState();
          return;
        }

        if (this.batchEnabled()) {
          this.onSupplierChange.emit(value);
        } else {
          this.onSupplierChange.emit("");
        }

        this.onMineChange.emit("");

        this.updateBatchControlsState();
      });

    mineControl.valueChanges
      .pipe(
        startWith(mineControl.value),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(mineId => {
        batchControl.reset(null, { emitEvent: false });
        batchNameControl.reset(null, { emitEvent: false });
        batchControl.markAsPristine();
        batchControl.markAsUntouched();
        batchNameControl.markAsPristine();
        batchNameControl.markAsUntouched();

        if (!mineId || !this.batchEnabled()) {
          this.onMineChange.emit("");
          this.updateBatchControlsState();
          return;
        }

        this.onMineChange.emit(mineId);
        this.updateBatchControlsState();
      });

    batchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (batchNameControl.value !== null && batchNameControl.value !== "") {
          batchNameControl.reset(null, { emitEvent: false });
        } else {
          batchNameControl.setValue(null, { emitEvent: false });
        }
        batchNameControl.markAsPristine();
        batchNameControl.markAsUntouched();
        this.form.updateValueAndValidity({ emitEvent: false });
      });

    batchNameControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value === null || value === "") {
          return;
        }

        if (batchControl.value !== null) {
          batchControl.reset(null, { emitEvent: false });
        } else {
          batchControl.setValue(null, { emitEvent: false });
        }
        batchControl.markAsPristine();
        batchControl.markAsUntouched();
        this.form.updateValueAndValidity({ emitEvent: false });
      });

    if (operationControl && originControl) {
      operationControl.valueChanges
        .pipe(
          startWith(operationControl.value),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(operationType => {
          if (operationType === EOrderScaleType.MOVEMENT) {
            originControl.enable({ emitEvent: false });
            originControl.setValidators([Validators.required]);
          } else {
            originControl.reset(null, { emitEvent: false });
            originControl.clearValidators();
            originControl.disable({ emitEvent: false });
          }

          originControl.updateValueAndValidity({ emitEvent: false });

				this.updateLotControlsForOperation(operationType as EOrderScaleType);
        });
    }

    if (materialTypeControl) {
      materialTypeControl.valueChanges
        .pipe(
          startWith(materialTypeControl.value),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(materialTypeId => {
          const enableBatch = this.shouldEnableBatch(materialTypeId, this.materialTypes() ?? []);
          this.updateBatchAvailability(enableBatch);

          const requiresRemission = this.checkRequiresRemissionDocument(materialTypeId, this.materialTypes() ?? []);
          this.updateRemissionDocumentRequirement(requiresRemission);
        });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.onCreate.emit(this.formService.getFormValue());
  }

  onCancelForm(): void {
    this.resetForm();
    this.onCancel.emit();
  }

  resetForm(): void {
    this.formService.resetForm();
    this.form.get("batchId")?.disable({ emitEvent: false });
    this.form.get("originStorageZoneId")?.disable({ emitEvent: false });
    this.form.get("batchName")?.enable({ emitEvent: false });
    this.form.get("mineId")?.disable({ emitEvent: false });
    this.batchEnabled.set(true);
    this.updateBatchControlsState();
    this.filteredVehicles.set(this.vehicles() ?? []);
  }

  onVehicleComplete(event: { query: string }): void {
    const query = (event?.query ?? "").trim().toLowerCase();
    const allVehicles = this.vehicles() ?? [];

    if (!query) {
      this.filteredVehicles.set(allVehicles);
      return;
    }

    this.filteredVehicles.set(
      allVehicles.filter(vehicle => {
        const plate = vehicle.plate?.toLowerCase() ?? "";
        const name = vehicle.name?.toLowerCase() ?? "";
        return plate.includes(query) || name.includes(query);
      })
    );
  }

  onVehicleClear(): void {
    this.filteredVehicles.set(this.vehicles() ?? []);
  }

  private shouldEnableBatch(materialTypeId: string | null | undefined, materials: IMaterialTypeCatalogEntity[]): boolean {
    if (!materialTypeId) {
      return true;
    }

    const material = materials.find(item => item.id === materialTypeId);
    if (material?.enableBatch === false) {
      return false;
    }

    return true;
  }

  private checkRequiresRemissionDocument(materialTypeId: string | null | undefined, materials: IMaterialTypeCatalogEntity[]): boolean {
    if (!materialTypeId) {
      return false;
    }

    const material = materials.find(item => item.id === materialTypeId);
    return material?.requiresRemissionDocument ?? false;
  }

  private updateRemissionDocumentRequirement(requiresRemission: boolean): void {
    this.requiresRemissionDocument.set(requiresRemission);

    const remissionControl = this.form.get("internalRemissionDocument");
    if (!remissionControl) {
      return;
    }

    if (requiresRemission) {
      remissionControl.setValidators([Validators.required]);
    } else {
      remissionControl.clearValidators();
      remissionControl.reset(null, { emitEvent: false });
    }
    remissionControl.updateValueAndValidity({ emitEvent: false });
  }

  private updateBatchAvailability(enableBatch: boolean): void {
    const previous = this.batchEnabled();
    this.batchEnabled.set(enableBatch);

    this.updateBatchControlsState();

    if (enableBatch && !previous) {
      const supplierValue = this.form.get("supplierId")?.value;
      if (supplierValue) {
        this.onSupplierChange.emit(supplierValue);
      }
    }
  }

  private updateBatchControlsState(): void {
    const batchControl = this.form.get("batchId");
    const batchNameControl = this.form.get("batchName");
    const supplierControl = this.form.get("supplierId");
    const mineControl = this.form.get("mineId");

    if (!batchControl || !batchNameControl || !mineControl || !supplierControl) {
      return;
    }

    const isMovement = this.isMovementOperation();

    if (!this.batchEnabled()) {
      this.formService.setBatchValidationEnabled(false);
      mineControl.reset(null, { emitEvent: false });
      batchControl.reset(null, { emitEvent: false });
      batchNameControl.reset(null, { emitEvent: false });
      mineControl.disable({ emitEvent: false });
      batchControl.disable({ emitEvent: false });
      batchNameControl.disable({ emitEvent: false });
      mineControl.markAsPristine();
      mineControl.markAsUntouched();
      batchControl.markAsPristine();
      batchControl.markAsUntouched();
      batchNameControl.markAsPristine();
      batchNameControl.markAsUntouched();
      return;
    }

    this.formService.setBatchValidationEnabled(true);

    if (isMovement) {
      batchNameControl.reset(null, { emitEvent: false });
      batchNameControl.disable({ emitEvent: false });
    } else {
      batchNameControl.enable({ emitEvent: false });
    }

    if (supplierControl?.value) {
      mineControl.enable({ emitEvent: false });
    } else {
      mineControl.disable({ emitEvent: false });
      batchControl.disable({ emitEvent: false });
      return;
    }

    if (mineControl.value) {
      batchControl.enable({ emitEvent: false });
    } else {
      batchControl.disable({ emitEvent: false });
    }
  }

  private updateLotControlsForOperation(operationType: EOrderScaleType): void {
    const supplierControl = this.form.get("supplierId");
    const batchNameControl = this.form.get("batchName");
    if (!supplierControl) {
      return;
    }

    if (operationType === EOrderScaleType.MOVEMENT) {
      batchNameControl?.reset(null, { emitEvent: false });
      this.updateBatchControlsState();
      return;
    }

    supplierControl.enable({ emitEvent: false });
    this.updateBatchControlsState();
  }

  private isMovementOperation(): boolean {
    return this.form.get("operationTypeWeightRegister")?.value === EOrderScaleType.MOVEMENT;
  }
}
