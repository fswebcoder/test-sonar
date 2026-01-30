import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { SafeResourceUrlPipe } from '@/shared/pipes/safe-resource-url.pipe';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-observer-detail',
  standalone: true,
  imports: [CommonModule, SafeResourceUrlPipe, ButtonComponent],
  templateUrl: './observer-detail.component.html'
})
export class ObserverDetailComponent {
  observer = input.required<IObserverEntity>();
  document = input<'cc' | 'arl'>('cc');
  onClose = output<void>();

  readonly ICONS = ICONS;

  get ccUrl(): string | null {
    return this.observer().documents?.ccUrl ?? null;
  }

  get arlUrl(): string | null {
    return this.observer().documents?.arlUrl ?? null;
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
