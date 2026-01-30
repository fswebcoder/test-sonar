import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { SafeResourceUrlPipe } from '@/shared/pipes/safe-resource-url.pipe';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-vehicle-detail',
  imports: [CommonModule, SafeResourceUrlPipe, ButtonComponent],
  templateUrl: './vehicle-detail.component.html'
})
export class VehicleDetailComponent {
  vehicle = input.required<IVehicle>();
  document = input<'soat' | 'technomechanical' | 'registration'>('soat');
  onClose = output<void>();

  readonly ICONS = ICONS;

  get title(): string {
    switch (this.document()) {
      case 'technomechanical':
        return 'Tecnomecánica';
      case 'registration':
        return 'Tarjeta de propiedad';
      default:
        return 'SOAT';
    }
  }

  get url(): string | null {
    const documents = this.vehicle().documents;
    switch (this.document()) {
      case 'technomechanical':
        return documents?.technomechanicalUrl ?? null;
      case 'registration':
        return documents?.registrationUrl ?? null;
      default:
        return documents?.soatUrl ?? null;
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
