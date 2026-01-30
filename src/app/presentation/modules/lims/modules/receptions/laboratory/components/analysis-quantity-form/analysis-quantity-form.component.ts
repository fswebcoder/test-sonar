import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { AnalysisCardComponent } from "../analysis-card/analysis-card.component";
import { IRequiredAnalysis } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';
import { Component, DestroyRef, effect, inject, input, OnInit, Injector } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators
} from '@angular/forms';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { Message } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-analysis-quantity-form',
  templateUrl: './analysis-quantity-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FloatSelectComponent,
    ButtonComponent,
    Message,
    AnalysisCardComponent
  ]
})
export class AnalysisQuantityFormComponent implements OnInit {
  defaultAnalyses = input.required<IRequiredAnalysis[]>();
  analysisTypes = input.required<IAnalysisTypeResponse[]>();
  parentForm = input.required<FormGroup>();

  destroyRef = inject(DestroyRef);
  injector = inject(Injector);
  fb = inject(FormBuilder);

  ICONS = ICONS;

  availableAnalysisTypes = input.required<IAnalysisTypeResponse[]>();

  internalForm!: FormGroup;

  get requiredAnalysesFormArray(): FormArray {
    return this.parentForm().get('requiredAnalyses') as FormArray;
  }

  ngOnInit() {
    this.initializeInternalForm();
    this.initializeRequiredAnalysesFormArray();

    effect(
      () => {
        const defaultAnalysisConfig = this.defaultAnalyses();
        const currentAnalyses = this.requiredAnalysesFormArray?.value as IRequiredAnalysis[];

        if ((!currentAnalyses || !currentAnalyses.length) && defaultAnalysisConfig?.length) {
          this.initializeWithDefaultAnalyses();
        }
      },
      { injector: this.injector }
    );
  }

  private initializeInternalForm() {
    this.internalForm = this.fb.group({
      selectedAnalysisId: ['', Validators.required]
    });
  }

  private initializeRequiredAnalysesFormArray() {
    const parentFormGroup = this.parentForm();
    if (!parentFormGroup.get('requiredAnalyses')) {
      parentFormGroup.addControl('requiredAnalyses', this.fb.array([]));
    }
  }

  hasValidFormArray(): boolean {
    return !!this.parentForm().get('requiredAnalyses') && this.requiredAnalysesFormArray instanceof FormArray;
  }

  private initializeWithDefaultAnalyses() {
    const defaultAnalyses = this.defaultAnalyses();
    defaultAnalyses.forEach(({ analysisId, quantity }) => {
      const normalizedQuantity = quantity && quantity > 0 ? quantity : 1;
      this.addAnalysisToFormArray(analysisId, normalizedQuantity);
    });
  }

  getAnalysisName(id: string): string {
    const analysis = this.analysisTypes().find(a => a.id === id);
    return analysis?.name || 'Análisis no encontrado';
  }

  getAnalysisShortName(id: string): string {
    const analysis = this.analysisTypes().find(a => a.id === id);
    return analysis?.name || 'N/A';
  }

  getCurrentAnalyses(): IRequiredAnalysis[] {
    return this.requiredAnalysesFormArray.value || [];
  }

  createAnalysisFormGroup(analysisId: string, quantity: number): FormGroup {
    return this.fb.group({
      analysisId: [analysisId, [Validators.required]],
      quantity: [quantity, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  addAnalysisToFormArray(analysisId: string, quantity: number = 1) {
    const analysisGroup = this.createAnalysisFormGroup(analysisId, quantity);
    this.requiredAnalysesFormArray.push(analysisGroup);
  }

  addAnalysis() {
    const selectedAnalysisId = this.internalForm.get('selectedAnalysisId')?.value;
    if (!selectedAnalysisId) return;

    const exists = this.getCurrentAnalyses().some(a => a.analysisId === selectedAnalysisId);

    if (!exists) {
      this.addAnalysisToFormArray(selectedAnalysisId, 1);
      this.internalForm.get('selectedAnalysisId')?.reset();
    }
  }

  removeAnalysis(index: number) {
    this.requiredAnalysesFormArray.removeAt(index);
  }

  getAnalysisFormGroup(index: number): FormGroup {
    return this.requiredAnalysesFormArray.at(index) as FormGroup;
  }

  getAvailableAnalysisTypes(): IAnalysisTypeResponse[] {
    const currentAnalysesIds = this.getCurrentAnalyses().map(a => a.analysisId);
    return this.analysisTypes().filter(at => !currentAnalysesIds.includes(at.id));
  }

  getTotalQuantity(): number {
    return this.getCurrentAnalyses().reduce((sum, a) => sum + a.quantity, 0);
  }

  get selectedAnalysisId() {
    return this.internalForm.get('selectedAnalysisId');
  }
}
