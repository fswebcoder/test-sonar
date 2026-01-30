import { ILeachwellResponseEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-response-entity';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { LeachwellCardComponent } from '../components/leachwell-card/leachwell-card.component';
import { CreateLeachwellFormDialogComponent } from '../components/create-leachwell-form-dialog/create-leachwell-form-dialog.component';
import { ILeachwellParamsEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-params.entity';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SmartScanInputComponent } from '@shared/components/form/smart-scan-input/smart-scan-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastCustomService, TPaginationParams } from '@SV-Development/utilities';
import { ICONS } from '@/shared/enums/general.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { PaginationService } from '@/shared/services/pagination.service';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { PermissionDirective } from '@/core/directives';
import { Router } from '@angular/router';

@Component({
  selector: 'svi-leachwell-dump',
  imports: [
    CommonModule,
    PaginatorModule,
    LeachwellCardComponent,
    ButtonComponent,
    CreateLeachwellFormDialogComponent,
    DialogComponent,
    EmptyStateComponent,
    SmartScanInputComponent,
    ReactiveFormsModule,
    PaginatorComponent,
    PermissionDirective
  ],
  templateUrl: './leachwell-dump.component.html',
  styleUrl: './leachwell-dump.component.scss'
})
export class LeachwellDumpComponent {
  toastService = inject(ToastCustomService);
  destroyRef = inject(DestroyRef);
  paginationService = inject(PaginationService);
  router = inject(Router);
  readonly path = this.router.url;
  isVisible = signal(false);

  ICONS = ICONS;

  scanForm!: FormGroup;

  @ViewChild(CreateLeachwellFormDialogComponent) formDialog!: CreateLeachwellFormDialogComponent;
  @ViewChild(SmartScanInputComponent) scanInput!: SmartScanInputComponent;

  leachwells = input<ILeachwellResponseEntity[]>([]);

  onPageChange = output<TPaginationParams>();
  onCompleteAnalisis = output<string>();
  onSave = output<ILeachwellParamsEntity>();

  ngOnInit() {
    this.initializeForm();
    this.listenScan();
  }

  initializeForm() {
    this.scanForm = new FormGroup({
      scanInput: new FormControl('')
    });
  }

  listenScan() {
    this.scanForm
      .get('scanInput')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe((value: string) => {
        if (value && value.trim() !== '') {
          this.onScan(value.trim());
        }
      });
  }

  openDialog() {
    this.isVisible.set(true);
    this.formDialog.resetForm();
  }

  closeDialog() {
    this.isVisible.set(false);
    this.resetForm();
  }

  completeAnalisis(event: ILeachwellResponseEntity) {
    this.onCompleteAnalisis.emit(event.sample.code);
  }

  resetForm() {
    this.formDialog?.resetForm();
  }

  onScan(event: string) {
    try {
      const leachwellToComplete = this.leachwells().find(x => x.sample.code === event);

      if (!leachwellToComplete) {
        this.toastService.error(`No se encontró una muestra en proceso con el código: ${event}`);
        this.resetScanner();
        return;
      }

      if (leachwellToComplete.done) {
        this.toastService.error(
          `La lixiviación para la muestra ${leachwellToComplete.sample.code} ya ha sido terminada`
        );
        this.resetScanner();
        return;
      }

      const currentTime = new Date();
      const endDateTime = new Date(leachwellToComplete.targetFinishDate);

      if (currentTime < endDateTime) {
        const remainingMinutes = Math.ceil((endDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
        this.toastService.error(
          `La lixiviación no puede ser terminada. Faltan ${remainingMinutes} minutos para completar el proceso.`
        );
        this.resetScanner();
        return;
      }

      this.onCompleteAnalisis.emit(event);
      this.resetScanner();
    } catch (error) {
      this.toastService.error('Error inesperado durante el proceso de escaneo');
      this.resetScanner();
    }
  }

  private resetScanner(): void {
    this.scanForm.reset();

    setTimeout(() => {
      if (this.scanInput) {
        this.scanInput.rescan();
      }
    }, 70);
  }

  get getTotalRecords(): number {
    return this.paginationService.getTotalRecords();
  }
}
