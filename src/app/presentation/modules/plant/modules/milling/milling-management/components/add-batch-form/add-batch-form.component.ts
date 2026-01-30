import { Component, input, output, computed, effect, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';

import IPumpEntity from '@/domain/entities/common/pump.entity';
import IMill from '@/domain/entities/plant/milling/mill.entity';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import IBatchEntity from '@/domain/entities/admin/suppliers/batches/batch.entity';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import IAddBatchParamsEntity from '@/domain/entities/plant/milling/add-batch-params.entity';
import { IIdName } from '@/shared/interfaces/id-name.interface';

@Component({
  selector: 'svi-add-batch-form',
  standalone: true,
  imports: [ReactiveFormsModule, ProgressBarModule, ButtonModule, FloatSelectComponent, ButtonComponent],
  template: `
    <div class="flex flex-col my-4">
      <div class="flex items-center justify-between text-xs text-color-secondary font-semibold">
        <span>ASIGNACIÓN DE LOTE</span>
        <span>{{ step() }}/{{ totalSteps() }}</span>
      </div>
      <p-progressBar [value]="progressValue()" [showValue]="false" styleClass="h-1rem my-2"></p-progressBar>
    </div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <svi-float-select
        formControlName="pumpId"
        [options]="pumps()"
        optionLabel="name"
        optionValue="id"
        label="Bomba"
        styleClass="w-full mb-3"
      />

      <svi-float-select
        formControlName="supplierId"
        [options]="suppliers()"
        optionLabel="name"
        optionValue="id"
        label="Proveedor"
        styleClass="w-full mb-3"
      />

      <svi-float-select
        formControlName="mineId"
        [options]="mines()"
        optionLabel="name"
        optionValue="id"
        label="Mina"
        styleClass="w-full mb-3"
        [disabled]="!form.get('supplierId')?.value"
      />

      <svi-float-select
        formControlName="batchId"
        [options]="batches()"
        optionLabel="code"
        optionValue="id"
        label="Lote"
        [disabled]="!form.get('mineId')?.value"
        styleClass="w-full mb-4"
      />

      <div class="flex align-items-center justify-content-end gap-4">
        <svi-button type="button" icon="{{ ICONS.CANCEL }}" severity="secondary" (click)="cancel()"
          >Cerrar</svi-button
        >
        <svi-button
          type="submit"
          icon="{{ ICONS.SAVE }}"
          label="Guardar"
          [disabled]="form.invalid"
          severity="primary"
        />
      </div>
    </form>
  `
})
export class AddBatchFormComponent {
  selectedMill = input.required<IMill | null>();
  pumps = input.required<IPumpEntity[]>();
  suppliers = input.required<IsupplierListResponseEntity[]>();
  mines = input<IIdName[]>([]);
  batches = input.required<IBatchEntity[]>();

  onSave = output<Omit<IAddBatchParamsEntity, "millId">>();
  onClose = output<void>();
  onSupplierIdChanges = output<string>();
  onMineIdChanges = output<string>();

  totalSteps = computed(() => 4);

  step = computed(() => {
    this.formValueSig();
    const pump = this.form.get('pumpId')!;
    const prov = this.form.get('supplierId')!;
    const mine = this.form.get('mineId')!;
    const batch = this.form.get('batchId')!;
    let done = 0;
    if (pump.valid) done++;
    if (prov.valid) done++;
    if (mine.enabled && mine.valid) done++;
    if (batch.enabled && batch.valid) done++;

    return done;
  });
  progressValue = computed(() => Math.round((this.step() / this.totalSteps()) * 100));

  form: FormGroup = new FormGroup({
    pumpId: new FormControl<string | null>(null, [Validators.required]),
    supplierId: new FormControl<string | null>(null, [Validators.required]),
    mineId: new FormControl<string | null>({ value: null, disabled: true }, [Validators.required]),
    batchId: new FormControl<string | null>({ value: null, disabled: true }, [Validators.required])
  });
  ICONS = ICONS;

  ngOnInit() {
    this.listenSupplierId();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const {pumpId, batchId} = this.form.value
    this.onSave.emit({
      pumpId,
      batchId
    })
  }

  cancel() {
    this.onClose.emit();
    this.clearForm();
  }

  clearForm() {
    this.form.reset();
  }

  toggleBatchEffect$ = effect(() => {
    const provId = this.supplierIdSig();
    const mineId = this.mineIdSig();
    const mineCtrl = this.form.get('mineId')!;
    const batchCtrl = this.form.get('batchId')!;

    if (provId) {
      mineCtrl.enable({ emitEvent: false });
    } else {
      mineCtrl.disable({ emitEvent: false });
    }

    if (provId && mineId) {
      batchCtrl.enable({ emitEvent: false });
    } else {
      batchCtrl.disable({ emitEvent: false });
    }
  });

  private supplierIdSig = toSignal(
    this.form.get('supplierId')!.valueChanges.pipe(startWith(this.form.get('supplierId')!.value)),
    { initialValue: this.form.get('supplierId')!.value }
  );

  private mineIdSig = toSignal(
    this.form.get('mineId')!.valueChanges.pipe(startWith(this.form.get('mineId')!.value)),
    { initialValue: this.form.get('mineId')!.value }
  );

  private listenSupplierId() {
    this.form.get('supplierId')!.valueChanges.subscribe(supplierId => {
      if (!supplierId) {
        this.form.get('mineId')!.reset(null, { emitEvent: false });
        this.form.get('batchId')!.reset(null, { emitEvent: false });
        this.form.get('mineId')!.disable();
        this.form.get('batchId')!.disable();
        this.onMineIdChanges.emit('');
      } else {
        this.form.get('mineId')!.reset(null, { emitEvent: false });
        this.form.get('batchId')!.reset(null, { emitEvent: false });
        this.form.get('batchId')!.disable({ emitEvent: false });
        this.onSupplierIdChanges.emit(supplierId);
      }
    });

    this.form.get('mineId')!.valueChanges.subscribe(mineId => {
      this.form.get('batchId')!.reset();

      if (!mineId) {
        this.form.get('batchId')!.disable();
        this.onMineIdChanges.emit('');
      } else {
        this.onMineIdChanges.emit(mineId);
      }
    });
  }

  private formValueSig = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())), {
    initialValue: this.form.getRawValue()
  });
}
