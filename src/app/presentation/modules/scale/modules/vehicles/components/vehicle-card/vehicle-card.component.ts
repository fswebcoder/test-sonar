import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { ScaleActions } from '@scale/modules/actions.enum';
import { ScaleCardComponent } from '@/shared/components/scale-card/scale-card.component';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'svi-vehicle-card',
  standalone: true,
  imports: [CommonModule, CardButtonComponent, ScaleCardComponent, MenuModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent {
  vehicle = input.required<IVehicle>();
  path = input.required<string>();

  onViewSoat = output<IVehicle>();
  onViewTechnomechanical = output<IVehicle>();
  onViewRegistration = output<IVehicle>();
  onEdit = output<IVehicle>();
  onActivate = output<IVehicle>();
  onDeactivate = output<IVehicle>();

  readonly ICONS = ICONS;
  readonly ScaleActions = ScaleActions;
  readonly EActionSeverity = EActionSeverity;

  statusLabel = computed(() => (this.vehicle().isActive ? 'Activo' : 'Inactivo'));
  statusType = computed(() => (this.vehicle().isActive ? 'active' : 'inactive'));

  hasAnyDocument = computed(() => {
    const documents = this.vehicle().documents;
    return Boolean(documents.soatUrl || documents.technomechanicalUrl || documents.registrationUrl);
  });

  documentMenuItems = computed<MenuItem[]>(() => {
    const documents = this.vehicle().documents;

    return [
      {
        label: 'SOAT',
        icon: ICONS.DOCUMENT,
        disabled: !documents.soatUrl,
        command: () => this.handleViewSoat()
      },
      {
        label: 'Tecnomecánica',
        icon: ICONS.DOCUMENT,
        disabled: !documents.technomechanicalUrl,
        command: () => this.handleViewTechnomechanical()
      },
      {
        label: 'Tarjeta de propiedad',
        icon: ICONS.DOCUMENT,
        disabled: !documents.registrationUrl,
        command: () => this.handleViewRegistration()
      }
    ];
  });

  handleViewSoat(): void {
    this.onViewSoat.emit(this.vehicle());
  }

  handleViewTechnomechanical(): void {
    this.onViewTechnomechanical.emit(this.vehicle());
  }

  handleViewRegistration(): void {
    this.onViewRegistration.emit(this.vehicle());
  }

  handleEdit(): void {
    this.onEdit.emit(this.vehicle());
  }

  handleActivate(): void {
    this.onActivate.emit(this.vehicle());
  }

  handleDeactivate(): void {
    this.onDeactivate.emit(this.vehicle());
  }
}
