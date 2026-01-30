 import { Component, computed, DestroyRef, effect, inject, input, output, ViewChild } from '@angular/core';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILaboratoryReceptionParams, IRequiredAnalysis } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';
import { Router } from '@angular/router';
import { PermissionDirective } from '@/core/directives';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';
import { ICONS } from '@/shared/enums/general.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import ISampleLaboratoryReceptionsResponse from '@/domain/entities/lims/receptions/laboratory/sample-laboratory-receptions.entity';
import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { AnalysisQuantityFormComponent } from "../components/analysis-quantity-form/analysis-quantity-form.component";
import { TagModule } from 'primeng/tag';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { formatWeight } from '@/core/utils/format-weight';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'svi-laboratory-dump',
  imports: [ButtonComponent, SmartScanInputComponent, ReactiveFormsModule, PermissionDirective, AnalysisQuantityFormComponent, TagModule, ConfirmDialogComponent],
  templateUrl: './laboratory-dump.component.html',
  styleUrl: './laboratory-dump.component.scss'
})
export class LaboratoryDumpComponent {
  router = inject(Router)
  destroyRef = inject(DestroyRef)
  fb = inject(FormBuilder)
  path = this.router.url;
  ICONS = ICONS;
  EWeightUnits = EWeightUnits;

  formatWeight = formatWeight

  sample = input.required<ISampleLaboratoryReceptionsResponse | null>()
  analysisTypes = input.required<IAnalysisTypeResponse[]>()

  hasRequiredAnalyses = computed(() => this.sample()?.hasRequiredAnalysis ?? false);
  defaultAnalyses = computed(() => (this.hasRequiredAnalyses() ? undefined : this.sample()?.defaultAnalyses));

  onCreateLaboratoryReception = output<ILaboratoryReceptionParams>();
  onSampleCodeChanges = output<string>();
  onCancel = output<void>();

  receptionAction = ReceptionAction;
  form!: FormGroup;
  toggleRequiredAnalysesValidator$ = effect(() => {
    if (!this.form) return;
    const requiredAnalysesControl = this.form.get('requiredAnalyses');
    if (!requiredAnalysesControl) return;

    if (this.hasRequiredAnalyses()) {
      requiredAnalysesControl.clearValidators();
    } else {
      requiredAnalysesControl.setValidators([Validators.required]);
    }
    requiredAnalysesControl.updateValueAndValidity({ emitEvent: false });
  });

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  ngOnInit() {
    this.createForm()
    this.listenSampleCode();
  }

  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const requiredAnalysesFormArray = this.form.get('requiredAnalyses') as any;
    const requiredAnalyses: IRequiredAnalysis[] = requiredAnalysesFormArray.value ?? [];
    
    const data: ILaboratoryReceptionParams = {
      sampleCode: this.form.value.sampleCode,
      requiredAnalyses: requiredAnalyses
    };
    this.onCreateLaboratoryReception.emit(data);
  }

  showConfirmSave(){
    this.confirmDialog.show(
      "¿Estás seguro de guardar los cambios?",
      () => this.save(),
      () => {}
    )
  }

  clearAllForms() {
    const requiredAnalysesFormArray = this.form.get('requiredAnalyses') as any;
    if (requiredAnalysesFormArray) {
      requiredAnalysesFormArray.clear();
    }

    this.form.reset('', { emitEvent: false });
    
    this.form.markAsUntouched();
    this.form.markAsPristine();
    
    this.form.get('sampleCode')?.setValue('', { emitEvent: false });

  }

  private createForm() {
    this.form = this.fb.group({
      sampleCode: ['', [Validators.required]],
      requiredAnalyses: this.fb.array([], [Validators.required])
    });
  }

  private listenSampleCode() {
    this.form.get('sampleCode')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300)
    ).subscribe(value => {
      if(!value) return
      this.onSampleCodeChanges.emit(value);
    });
  }


}