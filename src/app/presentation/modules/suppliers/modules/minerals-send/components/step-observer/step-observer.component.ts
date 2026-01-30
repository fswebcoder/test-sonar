import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { IObserverEntity } from '@/domain/entities/scale/observers/observer.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { LoadingComponent } from '@/shared/components/loading/loading.component';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ObserverDetailComponent } from '@/presentation/modules/scale/modules/observers/components/observer-detail/observer-detail.component';
import { SearchStepHeaderComponent } from '@/shared/components/search-step-header/search-step-header.component';

@Component({
  selector: 'svi-step-observer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchStepHeaderComponent, ButtonComponent, LoadingComponent, TagModule, MessageModule, DialogComponent, ObserverDetailComponent],
  templateUrl: './step-observer.component.html'
})
export class StepObserverComponent {
  readonly loadingService = inject(LoadingService);
  readonly LOADING = MINERAL_SEND_LOADING;

  searchObserver = output<string>();
  openCreateObserver = output<void>();
  openEditDocuments = output<void>();
  clearObserver = output<void>();

  observerSearchResult = input.required<IObserverEntity | null>();

  readonly ICONS = ICONS;

  documentControl = new FormControl<string>('', { nonNullable: true });

  readonly documentModal = signal(false);
  readonly selectedDocument = signal<'cc' | 'arl'>('cc');

  clearObserverSelection(): void {
    this.documentControl.setValue('', { emitEvent: true });
    this.documentControl.markAsPristine();
    this.documentControl.markAsUntouched();
    this.clearObserver.emit();
  }

  openObserverDocument(document: 'cc' | 'arl'): void {
    this.selectedDocument.set(document);
    this.documentModal.set(true);
  }

  closeObserverDocumentModal(): void {
    this.documentModal.set(false);
  }

  openEditDocumentsModal(): void {
    if (!this.observerSearchResult()) return;
    this.openEditDocuments.emit();
  }
}
