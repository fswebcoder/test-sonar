import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { SampleWeightComponent } from '@/shared/components/sample-weight/sample-weight.component';
import { ICONS } from '@/shared/enums/general.enum';
import { ISampleDisplayItemEntity } from '@/domain/entities/lims/receptions/samples/sample-display-item.entity';

@Component({
  selector: 'svi-add-weight-to-sample',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SampleWeightComponent],
  templateUrl: './add-weight-to-sample.component.html',
})
export class AddWeightToSampleComponent {
  ICONS = ICONS;

  sample = input<ISampleDisplayItemEntity | null>(null);
  weight = input<number | null>(null);
  manualWeight = input<number | null>(null);
  shouldEnableManualInput = input<boolean>(false);
  isReadingWeight = input<boolean>(false);

  onReadWeight = output<void>();
  onManualWeightChange = output<number | null>();
  onSave = output<void>();
  onCancel = output<void>();

  handleReadWeight(): void {
    this.onReadWeight.emit();
  }

  handleManualWeightChange(value: number | null): void {
    this.onManualWeightChange.emit(value);
  }

  handleSave(): void {
    this.onSave.emit();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}
