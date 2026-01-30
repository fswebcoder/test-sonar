import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { IVehicle } from '@/domain/entities/scale/vehicles/vehicle.entity';
import { ICONS } from '@/shared/enums/general.enum';
import { LoadingService } from '@/shared/services/loading.service';
import { LoadingComponent } from '@/shared/components/loading/loading.component';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { VehicleDetailComponent } from '@/presentation/modules/scale/modules/vehicles/components/vehicle-detail/vehicle-detail.component';
import { SearchStepHeaderComponent } from '@/shared/components/search-step-header/search-step-header.component';

@Component({
  selector: 'svi-step-vehicle',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SearchStepHeaderComponent,
    LoadingComponent,
    DialogComponent,
    VehicleDetailComponent,
    TagModule,
    MessageModule
  ],
  templateUrl: './step-vehicle.component.html'
})
export class StepVehicleComponent {
  readonly loadingService = inject(LoadingService);
  readonly LOADING = MINERAL_SEND_LOADING;

  searchVehicle = output<string>();
  openCreateVehicle = output<void>();
  openEditDocuments = output<void>();
  clearVehicle = output<void>();
  vehicleSearchResult = input.required<IVehicle | null>();

  readonly ICONS = ICONS;

  plateControl = new FormControl<string>('', { nonNullable: true });

  readonly documentModal = signal(false);
  readonly selectedDocument = signal<'soat' | 'technomechanical' | 'registration'>('soat');

  clearVehicleSelection(): void {
    this.plateControl.setValue('', { emitEvent: true });
    this.plateControl.markAsPristine();
    this.plateControl.markAsUntouched();
    this.clearVehicle.emit();
  }

  openVehicleDocument(document: 'soat' | 'technomechanical' | 'registration'): void {
    this.selectedDocument.set(document);
    this.documentModal.set(true);
  }

  closeVehicleDocumentModal(): void {
    this.documentModal.set(false);
  }

  openEditDocumentsModal(): void {
    if (!this.vehicleSearchResult()) return;
    this.openEditDocuments.emit();
  }
}
