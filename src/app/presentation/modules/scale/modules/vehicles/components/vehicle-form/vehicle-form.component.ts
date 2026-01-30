import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { VehicleFormService } from '@/presentation/modules/scale/modules/vehicles/services/vehicle-form.service';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { IVehicleTypeEntity } from '@/domain/entities/common/vehicle-type.entity';
import { ICreateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/create-vehicle-params.entity';
import { IUpdateVehicleParamsEntity } from '@/domain/entities/scale/vehicles/update-vehicle-params.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { VehiclePlateDirective } from '@SV-Development/utilities';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';

@Component({
  selector: 'svi-vehicle-form',
  imports: [
    ReactiveFormsModule,
    FloatInputComponent,
    FloatSelectComponent,
    ButtonComponent,
    VehiclePlateDirective,
    FileInputComponent
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss'
})
export class VehicleFormComponent {
  vehicle = input.required<IVehicle | null>();
  action = input.required<'create' | 'edit' | 'view'>();
  vehicleTypes = input.required<IVehicleTypeEntity[]>();

  private readonly formService = inject(VehicleFormService);

  form = this.formService.buildForm();
  isFormReady = signal<boolean>(false);
  ICONS = ICONS;

  private lastVehicleId: string | null = null;
  private lastAction: 'create' | 'edit' | 'view' | null = null;

  onCreate = output<ICreateVehicleParamsEntity>();
  onUpdate = output<IUpdateVehicleParamsEntity>();
  onCancel = output<void>();

  syncEffect$ = effect(() => {
    const vehicle = this.vehicle();
    const currentAction = this.action();

    const vehicleId = vehicle?.id ?? null;
    const shouldRebuild = this.lastAction !== currentAction || this.lastVehicleId !== vehicleId;

    if (shouldRebuild) {
      this.isFormReady.set(false);
      this.form = this.formService.buildForm(vehicle);
      this.isFormReady.set(true);
      this.lastAction = currentAction;
      this.lastVehicleId = vehicleId;
    }

    if (currentAction === 'view') {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  });

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.action() === 'create') {
      const { soat, technomechanical, registration, ...payload } = this.form.getRawValue() as any;
      this.onCreate.emit({
        ...(payload as any),
        soat: this.coerceSingleFile(soat),
        technomechanical: this.coerceSingleFile(technomechanical),
        registration: this.coerceSingleFile(registration)
      } as ICreateVehicleParamsEntity);
      return;
    }

    const vehicleId = this.vehicle()?.id ?? '';
    const { soat, technomechanical, registration, ...payload } = this.form.value as any;

    const documents: IUpdateVehicleParamsEntity['documents'] = {
      soat: this.coerceSingleFile(soat),
      technomechanical: this.coerceSingleFile(technomechanical),
      registration: this.coerceSingleFile(registration)
    };

    const hasAnyFile = Boolean(documents.soat || documents.technomechanical || documents.registration);

    this.onUpdate.emit({
      id: vehicleId,
      ...(payload as any),
      ...(hasAnyFile ? { documents } : {})
    } as IUpdateVehicleParamsEntity);
  }

  private coerceSingleFile(value: unknown): File | null {
    if (!value) return null;

    if (value instanceof File) {
      return value;
    }

    const maybeWrappedValue = (value as any)?.value;
    if (maybeWrappedValue) {
      return this.coerceSingleFile(maybeWrappedValue);
    }

    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      return value.item(0);
    }

    if (Array.isArray(value)) {
      const firstFile = value.find(v => v instanceof File);
      return firstFile ?? null;
    }

    return null;
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
