import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { SafeResourceUrlPipe } from '@/shared/pipes/safe-resource-url.pipe';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-driver-detail',
  imports: [CommonModule, SafeResourceUrlPipe, ButtonComponent],
  templateUrl: './driver-detail.component.html',
})
export class DriverDetailComponent {
  driver = input.required<IDriverEntity>();
  document = input<'cc' | 'arl'>('cc');
  onClose = output<void>();

  readonly ICONS = ICONS;

  get ccUrl(): string | null {
    return this.driver().documents?.ccUrl ?? null;
  }

  get arlUrl(): string | null {
    return this.driver().documents?.arlUrl ?? null;
  }

  get title(): string {
    return this.document() === 'cc' ? 'Documento' : 'ARL';
  }

  get url(): string | null {
    return this.document() === 'cc' ? this.ccUrl : this.arlUrl;
  }

  close(): void {
    this.onClose.emit();
  }
}
