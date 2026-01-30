import { IAnalysisTypeResponse } from "@/domain/entities/common/analysis-type-response.entity";
import { Component, DestroyRef, effect, inject, input, OnInit, Injector } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FloatMultiselectComponent } from "@/shared/components/form/multiselect/multiselect.component";
import { Message } from "primeng/message";
import { IRequiredAnalysis } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';

@Component({
  selector: 'svi-add-analyses-form',
  templateUrl: './add-analyses-form.component.html',
  imports: [ReactiveFormsModule, FloatMultiselectComponent, Message]
})
export class AddAnalysesFormComponent implements OnInit{

  defaultAnalyses = input.required<IRequiredAnalysis[]>();
  analysisTypes = input.required<IAnalysisTypeResponse[]>();
  parentForm = input.required<FormGroup>();
  destroyRef = inject(DestroyRef);
  injector = inject(Injector);

  ngOnInit() {
    const parentFormGroup = this.parentForm();
    const selectedRequiredAnalysesIds = parentFormGroup.get('requiredAnalysesIds')?.value as string[] | undefined;
    if (!selectedRequiredAnalysesIds || !selectedRequiredAnalysesIds.length) {
  const defaultRequiredAnalysesIds = this.defaultAnalyses().map(a => a.analysisId);
      parentFormGroup.patchValue({ requiredAnalysesIds: defaultRequiredAnalysesIds });
    }

    effect(() => {
      const defaultAnalysisTypes = this.defaultAnalyses();
      const formGroup = this.parentForm();
      const currentRequiredIds = formGroup.get('requiredAnalysesIds')?.value as string[] | undefined;
      if ((!currentRequiredIds || !currentRequiredIds.length) && defaultAnalysisTypes?.length) {
        formGroup.patchValue({ requiredAnalysesIds: defaultAnalysisTypes.map(a => a.analysisId) });
      }
    }, { injector: this.injector });


  }

  getAnalysisShortName(id: string): string {
    const analysis = this.analysisTypes().find(a => a.id === id);
    return analysis ? analysis.analysisShortName : id;
  }



}
