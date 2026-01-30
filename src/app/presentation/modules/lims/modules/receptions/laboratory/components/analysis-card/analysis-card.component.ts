import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberComponent } from '@/shared/components/form/input-number/input-number.component';
import { ICONS } from '@/shared/enums/general.enum';
import { CardButtonComponent } from '@/shared/components/card-button/card-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';
import { ERROR_DEFS } from '@/shared/components/form/error-def';

@Component({
  selector: 'svi-analysis-card',
  templateUrl: './analysis-card.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardButtonComponent,
    InputNumberComponent
  ]
})
export class AnalysisCardComponent {
  analysisFormGroup = input.required<FormGroup>();
  analysisName = input.required<string>();
  index = input.required<number>();
  
  onRemove = output<number>();
  
  ICONS = ICONS;
  readonly EActionSeverity = EActionSeverity;
  errorMessages = ERROR_DEFS["analysisQuantity"]
  
  removeAnalysis() {
    this.onRemove.emit(this.index());
  }
}