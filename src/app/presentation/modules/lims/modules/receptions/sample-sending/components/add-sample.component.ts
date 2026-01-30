import { ISampleType } from '@/domain/entities/common/sample-reception-origin.response.entity';
import { IAnalysisTypeResponse } from '@/domain/entities/common/analysis-type-response.entity';
import { ISendingSampleItemEntity } from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-params.entity';
import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatSelectComponent } from '@shared/components/form/float-select/float-select.component';
import { FloatInputComponent } from '@shared/components/form/float-input/float-input.component';
import { IIdName } from '@/shared/interfaces/id-name.interface';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { CheckboxComponent } from '@/shared/components/form/checkbox/checkbox.component';
import { getCurrentDateString } from '@core/utils/get-current-date-string';
import { ICONS } from '@shared/enums/general.enum';
import { AnalysisQuantityFormComponent } from '@/presentation/modules/lims/modules/receptions/laboratory/components/analysis-quantity-form/analysis-quantity-form.component';
import { IRequiredAnalysis } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';

@Component({
  selector: 'svi-add-samples',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatSelectComponent,
    FloatInputComponent,
    ButtonComponent,
    AnalysisQuantityFormComponent,
    CheckboxComponent
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-column gap-4 p-4">
      <svi-float-select
        [options]="sampleTypes()"
        formControlName="sampleTypeId"
        label="Tipo de muestra"
        optionValue="id"
        optionLabel="name"
        filterBy="name"
        [filter]="true"
      ></svi-float-select>

      <svi-float-input formControlName="code" label="Código de muestra" type="text"></svi-float-input>

      @if (autogenerateCode()) {
        <div class="flex gap-4">
          <svi-float-select
            formControlName="mill"
            label="Molino"
            [options]="mills()"
            optionLabel="name"
            optionValue="id"
          ></svi-float-select>
          <svi-float-select
            formControlName="shift"
            label="Turno"
            [options]="shifts()"
            optionLabel="name"
            optionValue="id"
          ></svi-float-select>
        </div>
      }

      @if (analysisTypes().length) {
        <svi-analysis-quantity-form
          [analysisTypes]="analysisTypes()"
          [availableAnalysisTypes]="analysisTypes()"
          [defaultAnalyses]="defaultAnalyses()"
          [parentForm]="form"
        ></svi-analysis-quantity-form>
      } @else {
        <small class="text-sm text-color-secondary">No hay análisis configurados para asignar.</small>
      }

      <div class="flex align-items-center justify-content-between flex-wrap gap-4">
        <svi-checkbox
          formControlName="moistureDetermination"
          [label]="'¿Determinación de humedad?'"
        ></svi-checkbox>

        <div class="flex justify-content-end gap-4">
          <svi-button [icon]="ICONS.CANCEL" severity="secondary" type="button" (click)="cancel()" label="Cancelar"></svi-button>
          <svi-button [icon]="ICONS.ADD" [disabled]="form.invalid" type="submit" label="Agregar"></svi-button>
        </div>
      </div>
    </form>
  `
})
export class AddSamplesComponent implements OnInit {
  sampleTypes = input.required<ISampleType[]>();
  supplierShortName = input.required<string>();
  mills = input.required<IIdName[]>();
  shifts = input.required<IIdName[]>();
  analysisTypes = input.required<IAnalysisTypeResponse[]>();

  onAddSample = output<ISendingSampleItemEntity>();
  onCancel = output<void>();

  form!: FormGroup;
  ICONS = ICONS;

  autogenerateCode = signal<boolean>(false);
  private fb = inject(FormBuilder);
  private selectedSampleType = signal<ISampleType | null>(null);

  defaultAnalyses = computed<IRequiredAnalysis[]>(() => {
    const sampleType = this.selectedSampleType();
    if (!sampleType?.defaultAnalysesIds?.length) {
      return [];
    }

    return sampleType.defaultAnalysesIds.map((analysisId): IRequiredAnalysis => ({
      analysisId,
      quantity: 1
    }));
  });

  codeEffect$ = effect(() => {
    if (!this.form) return;
    if (this.autogenerateCode()) {
      this.generateCode();
      return;
    }
    const codeCtrl = this.form.get('code');
    if (codeCtrl?.pristine) codeCtrl.setValue(null, { emitEvent: false });
  });

  ngOnInit() {
    this.createForm();
    this.setupSampleTypeListener();
    this.setupDynamicCodeListeners();
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      this.form.markAllAsTouched();
      return;
    }
    this.onAddSample.emit(this.buildSubmitData());
  }

  cancel() {
    this.onCancel.emit();
    this.clearForm();
  }

  clearForm() {
    const analyses = this.getRequiredAnalysesArray();
    analyses.clear();
    analyses.markAsPristine();
    analyses.markAsUntouched();
    analyses.updateValueAndValidity({ emitEvent: false });
    this.form.reset({
      moistureDetermination: false
    });
    const codeCtrl = this.form.get('code');
    if (codeCtrl && codeCtrl.disabled) {
      codeCtrl.enable({ emitEvent: false });
    }
    this.selectedSampleType.set(null);
    this.autogenerateCode.set(false);
  }

  private buildSubmitData(): ISendingSampleItemEntity {
    const { analysisClone, sampleClone } = this.cloneSamplePayload();
    return {
      code: sampleClone.code,
      sampleTypeId: sampleClone.sampleTypeId,
      moistureDetermination: sampleClone.moistureDetermination,
      requiredAnalyses: analysisClone
    };
  }

  private createForm() {
    this.form = this.fb.group({
      sampleTypeId: new FormControl(null, [Validators.required]),
      code: new FormControl(this.supplierShortName(), [Validators.required]),
      mill: new FormControl(null),
      shift: new FormControl(null),
      requiredAnalyses: this.fb.array([], Validators.required),
      moistureDetermination: new FormControl(false)
    });
  }
  private setupSampleTypeListener(): void {
    const sampleTypeCtrl = this.form.get('sampleTypeId');
    const codeCtrl = this.form.get('code') as FormControl | null;
    if (!sampleTypeCtrl || !codeCtrl) return;

    sampleTypeCtrl.valueChanges.subscribe(val => {
      const shouldAuto = this.shouldAutogenerateCode(val);
      this.autogenerateCode.set(shouldAuto);

      if (shouldAuto) {
        this.enableAutoCode(codeCtrl);
      } else {
        this.enableManualCode(codeCtrl);
      }
      this.updateSelectedSampleType(val);
      this.resetRequiredAnalyses();
    });
  }

  private shouldAutogenerateCode(val: any): boolean {
    const found = this.sampleTypes().find(s => s.id.toString() === (val?.toString?.() || val));
    return !!found?.autoGenerateCode;
  }

  private enableAutoCode(codeCtrl: FormControl): void {
    if (codeCtrl.enabled) codeCtrl.disable({ emitEvent: false });
    this.generateCode();
  }

  private enableManualCode(codeCtrl: FormControl): void {
    if (codeCtrl.disabled) codeCtrl.enable({ emitEvent: false });
    codeCtrl.setValue(null);
  }

  private setupDynamicCodeListeners(): void {
    ['shift', 'mill'].forEach(field => {
      this.form.get(field)?.valueChanges.subscribe(() => {
        if (this.autogenerateCode()) this.generateCode();
      });
    });
  }

  private getRequiredAnalysesArray(): FormArray {
    return this.form.get('requiredAnalyses') as FormArray;
  }

  private resetRequiredAnalyses(): void {
    const arr = this.getRequiredAnalysesArray();
    arr.clear();
    arr.markAsPristine();
    arr.markAsUntouched();
    arr.updateValueAndValidity({ emitEvent: false });
  }

  private generateCode(): void {
    if (!this.autogenerateCode()) return;

    const supplier = this.supplierShortName();
    const date = getCurrentDateString();
    const stId = this.form.get('sampleTypeId')?.value;
    const found = this.sampleTypes().find(s => s.id.toString() === (stId?.toString?.() || stId));

    const shortName = found?.shortName || '';
    const shift = this.normalizeCodeSegment(this.form.get('shift')?.value);
    const mill = this.normalizeCodeSegment(this.form.get('mill')?.value);
    const code = `${supplier}${date}${shortName}${shift}${mill}`;

    this.form.get('code')?.setValue(code, { emitEvent: false });
  }

  private normalizeCodeSegment(seg: any): string {
    if (!seg) return '';
    if (typeof seg === 'string') return seg;
    return seg?.id || '';
  }

  private updateSelectedSampleType(sampleTypeId: unknown): void {
    const found = this.sampleTypes().find(s => s.id.toString() === (sampleTypeId?.toString?.() || sampleTypeId));
    this.selectedSampleType.set(found ?? null);
  }

  private cloneSamplePayload(): {
    sampleClone: { code: string; sampleTypeId: string; moistureDetermination: boolean };
    analysisClone: IRequiredAnalysis[];
  } {
    const raw = this.form.getRawValue();
    const samplePayload = {
      code: raw.code as string,
      sampleTypeId: raw.sampleTypeId as string,
      moistureDetermination: !!raw.moistureDetermination
    };
    const analyses = (raw.requiredAnalyses ?? []) as IRequiredAnalysis[];
    const clone =
      typeof globalThis.structuredClone === 'function'
        ? globalThis.structuredClone(analyses)
        : JSON.parse(JSON.stringify(analyses));
    return {
      sampleClone: samplePayload,
      analysisClone: clone
    };
  }
}
