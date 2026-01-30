import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { IMaterialTypeEntity } from '@/domain/entities/scale/material-types/material-type.entity';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';

import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';

@Component({
  selector: 'svi-step-summary',
  imports: [CommonModule, DividerModule, MessageModule, TagModule],
  templateUrl: './step-summary.component.html'
})
export class StepSummaryComponent {
  mines = input.required<IMineEntity[]>();
  materialTypes = input.required<IMaterialTypeEntity[]>();
  form = input.required<FormGroup>();

  vehicle = input.required<IVehicle | null>();
  driver = input.required<IDriverEntity | null>();
  observer = input<IObserverEntity | null>(null);
  requireObserver = input<boolean>(false);

  readonly generalInfo = computed(() => {
    const raw = this.form().getRawValue() as Record<string, unknown>;
    return {
      mineId: (raw['mineId'] as string | null) ?? null,
      materialTypeId: (raw['materialTypeId'] as string | null) ?? null,
      supplierBatchName: (raw['supplierBatchName'] as string | null) ?? null,
      sendedWeight: (raw['sendedWeight'] as number | null) ?? null,
      notificationMail: (raw['notificationMail'] as string | null) ?? null
    };
  });

  readonly EWeightUnits = EWeightUnits

  readonly mineName = computed(() => {
    const mineId = this.generalInfo().mineId;
    return this.mines().find(m => m.id === mineId)?.name ?? '—';
  });

  readonly materialTypeName = computed(() => {
    const materialTypeId = this.generalInfo().materialTypeId;
    return this.materialTypes().find(m => m.id === materialTypeId)?.name ?? '—';
  });

  readonly canFinish = computed(() => {
    if (this.form().invalid) return false;
    if (!this.vehicle()) return false;
    if (!this.driver()) return false;
    if (this.requireObserver() && !this.observer()) return false;
    return true;
  });
}
