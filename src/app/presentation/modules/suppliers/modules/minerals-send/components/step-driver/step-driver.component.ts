import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { ICONS } from '@/shared/enums/general.enum';
import { IDriverEntity } from '@/domain/entities/scale/drivers/driver.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { LoadingComponent } from '@/shared/components/loading/loading.component';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { DriverDetailComponent } from '@/presentation/modules/scale/modules/drivers/components/driver-detail/driver-detail.component';
import { SearchStepHeaderComponent } from '@/shared/components/search-step-header/search-step-header.component';

@Component({
  selector: 'svi-step-driver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchStepHeaderComponent, ButtonComponent, CheckboxComponent, LoadingComponent, TagModule, MessageModule, DialogComponent, DriverDetailComponent],
  templateUrl: './step-driver.component.html'
})
export class StepDriverComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly loadingService = inject(LoadingService);
  readonly LOADING = MINERAL_SEND_LOADING;

  searchDriver = output<string>();
  openCreateDriver = output<void>();
  openEditDocuments = output<void>();
  clearDriver = output<void>();
  requireObserverChange = output<boolean>();

  driverSearchResult = input.required<IDriverEntity | null>();
  requireObserver = input<boolean>(false);

  readonly ICONS = ICONS;

  documentControl = new FormControl<string>('', { nonNullable: true });
  requireObserverControl = new FormControl<boolean>(false, { nonNullable: true });

  readonly documentModal = signal(false);
  readonly selectedDocument = signal<'cc' | 'arl'>('cc');

  ngOnInit() {
    this.initRequireObserver();
  }

  clearDriverSelection(): void {
    this.documentControl.setValue('', { emitEvent: true });
    this.documentControl.markAsPristine();
    this.documentControl.markAsUntouched();
    this.clearDriver.emit();
  }

  openDriverDocument(document: 'cc' | 'arl'): void {
    this.selectedDocument.set(document);
    this.documentModal.set(true);
  }

  closeDriverDocumentModal(): void {
    this.documentModal.set(false);
  }

  openEditDocumentsModal(): void {
    if (!this.driverSearchResult()) return;
    this.openEditDocuments.emit();
  }
  
  private initRequireObserver(): void {
    this.requireObserverControl.setValue(!!this.requireObserver(), { emitEvent: false });

    this.requireObserverControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((value) => {
        this.requireObserverChange.emit(!!value);
      });
  }
}
