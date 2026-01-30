import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-smelting-scan-controller',
  standalone: true,
  imports: [DialogComponent, ReactiveFormsModule, SmartScanInputComponent, FloatInputComponent, ButtonComponent],
  template: `
    <svi-dialog
      [visible]="visible"
      (visibleChange)="onVisible($event)"
      [header]="weightMode ? 'Asignar Peso régulo' : 'Escanear Muestra'"
    >
      <form *ngIf="!weightMode" [formGroup]="sampleForm" (ngSubmit)="submitSample()" class="flex flex-col gap-4">
        <svi-smart-scan-input formControlName="sampleCode" label="Código" />
        <div class="flex gap-2 justify-end">
          <svi-button type="button" (onClick)="cancel.emit()" label="Cancelar"></svi-button>
          <svi-button type="submit" [disabled]="sampleForm.invalid" label="Aceptar"></svi-button>
        </div>
      </form>
      <form *ngIf="weightMode" [formGroup]="weightForm" (ngSubmit)="submitWeight()" class="flex flex-col gap-4">
        <svi-float-input formControlName="regulusWeight" label="Peso" />
        <div class="flex gap-2 justify-end">
          <svi-button type="button" (onClick)="cancel.emit()" label="Cancelar"></svi-button>
          <svi-button type="submit" [disabled]="weightForm.invalid" label="Aceptar"></svi-button>
        </div>
      </form>
    </svi-dialog>
  `
})
export class SmeltingScanControllerComponent {
  @Input() visible = false;
  @Input() weightMode = false;
  @Input() sampleValue: string | null = null;
  @Input() weightValue: number | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();
  @Output() confirmSample = new EventEmitter<string>();
  @Output() confirmWeight = new EventEmitter<number>();
  ICONS = ICONS;

  sampleForm = new FormGroup({
    sampleCode: new FormControl<string | null>(null, [Validators.required])
  });
  weightForm = new FormGroup({
    regulusWeight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.0001)])
  });

  ngOnChanges() {
  this.sampleForm.patchValue({ sampleCode: this.sampleValue });
  this.weightForm.patchValue({ regulusWeight: this.weightValue });
  }

  submitSample() {
    if (this.sampleForm.invalid) return;
    const val = (this.sampleForm.get('sampleCode')?.value || '').trim();
    if (!val) return;
    this.confirmSample.emit(val);
  }

  submitWeight() {
    if (this.weightForm.invalid) return;
    const val = this.weightForm.get('regulusWeight')?.value;
    if (val === null || val === undefined || val === 0) return;
    this.confirmWeight.emit(val);
  }

  onVisible(v: boolean) { this.visibleChange.emit(v); }
}
