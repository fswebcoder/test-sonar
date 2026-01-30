import { Component, DestroyRef, effect, inject, input, output } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { PermissionDirective } from "@/core/directives";

import { IIdName } from "@/shared/interfaces/id-name.interface";
import { ScaleActions } from "@scale/modules/actions.enum";
import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";
import { ICONS } from "@/shared/enums/general.enum";

@Component({
  selector: "svi-assign-batch-order-form",
  standalone: true,
  imports: [ReactiveFormsModule, FloatSelectComponent, FloatInputComponent, ButtonComponent, PermissionDirective],
  templateUrl: "./assign-batch-order-form.component.html"
})
export class AssignBatchOrderFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  orderId = input.required<string>();
  permissionsPath = input.required<string>();

  batches = input<IIdName[]>([]);

  cancelRequested = output<void>();
  submitted = output<IAsignBatchOrderParams>();

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;

  readonly form: FormGroup = this.formBuilder.group(
    {
      batchId: [null],
      batchName: [null]
    },
    { validators: (control: AbstractControl) => this.assignBatchValidator(control) }
  );

  constructor() {
    effect(() => {
      const currentOrderId = this.orderId();
      if (!currentOrderId) {
        return;
      }

      this.resetForm();
    });

    this.listenToFormChanges();
  }

  onCancel(): void {
    this.resetForm();
    this.cancelRequested.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue() as {
      batchId: string | null;
      batchName: string | null;
    };

    const batchName = (raw.batchName ?? "").trim();
    const payload: IAsignBatchOrderParams = {
      orderId: this.orderId(),
      batchId: raw.batchId ?? undefined,
      batchName: batchName || undefined
    };

    if (payload.batchId && payload.batchName) {
      payload.batchName = undefined;
    }

    this.submitted.emit(payload);
  }

  private resetForm(): void {
    this.form.reset(
      {
        batchId: null,
        batchName: null
      },
      { emitEvent: false }
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private listenToFormChanges(): void {
    const batchControl = this.form.get("batchId");
    const batchNameControl = this.form.get("batchName");

    batchControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value) {
          batchNameControl?.reset(null, { emitEvent: false });
        }
        this.form.updateValueAndValidity({ emitEvent: false });
      });

    batchNameControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        const text = (value ?? "").toString().trim();
        if (!text) {
          this.form.updateValueAndValidity({ emitEvent: false });
          return;
        }

        batchControl?.reset(null, { emitEvent: false });
        this.form.updateValueAndValidity({ emitEvent: false });
      });
  }

  private assignBatchValidator(control: AbstractControl): ValidationErrors | null {
    const batchId = control.get("batchId")?.value as string | null;
    const batchNameRaw = control.get("batchName")?.value as string | null;

    const batchName = (batchNameRaw ?? "").trim();

    if (batchId && batchName) {
      return { batchConflict: true };
    }

    if (!batchId && !batchName) {
      return { batchMissing: true };
    }

    return null;
  }
}
