import { SmartScanInputComponent } from '@/shared/components/form/smart-scan-input/smart-scan-input.component';
import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { AddWeightComponent } from '../components/add-weight/add-weight.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { IQuarteringItemEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-items.entity';
import { IQuarteringParamsEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-params.entity';
import { QuarteringListComponent } from '../components/quartering-list/quartering-list.component';
import { ToastCustomService } from '@SV-Development/utilities';
import { Router } from '@angular/router';
import { PermissionDirective } from '@/core/directives';
import {
  IRequiredAnalysisQuarteringEntity,
  ISampleQuarteringDetailsResponseEntity
} from '@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity';
import { debounceTime } from 'rxjs';
import { ICONS } from '@/shared/enums/general.enum';
import { ReceptionAction } from '@/presentation/modules/lims/modules/generic.enum';

@Component({
  selector: 'svi-quartering-dump',
  standalone: true,
  imports: [
    SmartScanInputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    AddWeightComponent,
    DialogComponent,
    QuarteringListComponent,
    PermissionDirective
  ],
  templateUrl: './quartering-dump.component.html',
  styleUrl: './quartering-dump.component.scss'
})
export class QuarteringDumpComponent {
  ICONS = ICONS;

  form!: FormGroup;
  fb = inject(FormBuilder);
  toastService = inject(ToastCustomService);
  showResultsModal = signal(false);
  selectedAnalysis = signal<any>(null);
  router = inject(Router);
  path = this.router.url;
  receptionAction = ReceptionAction;
  modalUpdateTrigger = signal(0);
  previousSampleId = signal<string | null>(null);

  sampleDetail = input.required<ISampleQuarteringDetailsResponseEntity>();
  subSamplesSignal = signal<IQuarteringItemEntity[]>([]);

  receivedWeight = computed<number>(() => {
    if (this.sampleDetail()) {
      return Number(this.sampleDetail()!.receivedWeight);
    }
    return 0;
  });

  existingSubSamplesWeight = computed<number>(() => {
    const sample = this.sampleDetail();
    if (sample && sample.quartering) {
      const totalWeight = sample.quartering.reduce((acc, quartering) => acc + (quartering.weight || 0), 0);
      return totalWeight;
    }
    return 0;
  });

  maxWeightAllowed = computed<number>(() => {
    const totalQuartered = this.subSamplesSignal().reduce(
      (acc: number, item: IQuarteringItemEntity) => acc + (item.weight || 0),
      0
    );
    const existingWeight = this.existingSubSamplesWeight();
    const maxWeightAllowed = this.receivedWeight() - totalQuartered - existingWeight;
    return maxWeightAllowed > 0 ? maxWeightAllowed : 0;
  });

  requiredAnalysis = computed<IRequiredAnalysisQuarteringEntity[]>(() => {
    const analysis =
      this.sampleDetail() && this.sampleDetail().requiredAnalyses ? this.sampleDetail().requiredAnalyses : [];
    analysis.map(x => {
      x.analysisName = `${x.analysisName} - ${x.replicatedIndex}`;
    });
    return analysis;
  });

  subSamples = computed(() => {
    return this.subSamplesSignal();
  });

  hasValidSample = computed(() => {
    const sample = this.sampleDetail();
    return (
      sample !== null &&
      sample !== undefined &&
      sample.sampleId &&
      sample.receivedWeight &&
      Number(sample.receivedWeight) > 0
    );
  });

  hasQuarteringsToSave = computed(() => {
    const subSamples = this.subSamplesSignal();
    const hasValidSample = this.hasValidSample();
    return hasValidSample && subSamples.length > 0;
  });

  ouputDetail = output<string>();
  onSaveQuarterings = output<IQuarteringParamsEntity>();

  syncExistingSubSamplesEffect$ = effect(() => {
    const sample = this.sampleDetail();
    const existingWeight = this.existingSubSamplesWeight();
    if (sample && sample.quartering && sample.quartering.length > 0 && existingWeight > 0) {
      this.toastService.info(
        `Esta muestra tiene ${sample.quartering.length} cuarteo(s) existente(s) con un peso total de ${existingWeight} gr`
      );
    }
  });

  syncSubSamplesFormEffect$ = effect(() => {
    const formValue = this.form?.get('subSamples')?.value || [];
    this.subSamplesSignal.set([...formValue]);
  });

  ngOnInit() {
    this.initForm();
    this.listenSampleCode();
  }

  initForm() {
    this.form = this.fb.group({
      sampleCode: new FormControl(null, [Validators.required]),
      subSamples: new FormControl([])
    });
  }

  listenSampleCode() {
    this.form
      .get('sampleCode')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(value => {
        if (!value) return;
        this.onSampleCodeChange(value);
      });
  }

  onCloseResultsModal() {
    this.showResultsModal.set(false);
  }

  openQuarteringModal() {
    if (!this.hasValidSample()) {
      this.toastService.error('Debe seleccionar una muestra válida antes de realizar el cuarteo');
      return;
    }
    this.showResultsModal.set(true);
  }

  onSampleCodeChange(event: string) {
    this.resetAllForms();
    this.ouputDetail.emit(event);
  }

  onAddQuartering(quartering: any) {
    const totalQuarteredWeight = this.getTotalQuarteredWeight();
    const newTotal = this.calculateNewTotalWeight(totalQuarteredWeight, quartering.weight);

    if (this.exceedsTotalWeight(newTotal)) {
      this.showExceedToast(totalQuarteredWeight, quartering.weight);
      return;
    }

    const quarteringItem = this.buildQuarteringItem(quartering);
    this.appendQuarteringItem(quarteringItem);

    this.handlePostAddFeedback(newTotal);

    this.modalUpdateTrigger.update(trigger => trigger + 1);
  }

  onDeleteQuartering(id: string) {
    const currentQuarterings = this.subSamplesSignal();
    const filteredQuarterings = currentQuarterings.filter(
      (item: IQuarteringItemEntity) => item.requiredAnalysisId !== id
    );

    this.subSamplesSignal.set(filteredQuarterings);
    this.form.get('subSamples')?.setValue(filteredQuarterings);
  }

  formatWeight(value: number): string {
    const numValue = Number(value);
    return numValue.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
      useGrouping: true
    });
  }

  saveQuarterings() {
    if (!this.hasValidSample()) {
      this.toastService.error('Debe seleccionar una muestra válida antes de guardar los cuarteos');
      return;
    }

    const subSamples = this.subSamplesSignal();
    if (subSamples.length === 0) {
      this.toastService.error('No hay cuarteos para guardar');
      return;
    }

    const sampleCode = this.form.get('sampleCode')?.value;

    const quarteringParams: IQuarteringParamsEntity = {
      sampleCode: sampleCode,
      quartering: subSamples.map(
        (item: IQuarteringItemEntity): IQuarteringItemEntity => ({
          weight: item.weight,
          requiredAnalysisId: item.requiredAnalysisId,
          replicatedIndex: undefined,
          requiresFa: item.requiresFa
        })
      )
    };
    this.onSaveQuarterings.emit(quarteringParams);
  }

  private getTotalQuarteredWeight(): number {
    return this.subSamplesSignal().reduce(
      (acc: number, item: IQuarteringItemEntity) => acc + Number(item.weight || 0),
      0
    );
  }

  private calculateNewTotalWeight(currentTotal: number, newWeight: number): number {
    return Number(currentTotal) + Number(newWeight);
  }

  private exceedsTotalWeight(newTotal: number): boolean {
    return newTotal > this.receivedWeight();
  }

  private showExceedToast(currentTotal: number, newWeight: number): void {
    const availableWeight = this.receivedWeight() - currentTotal;
    const exceeded = +(newWeight - availableWeight).toFixed(3);
    if (exceeded > 0) {
      this.toastService.error(
        `No se puede agregar el cuarteo. El peso ingresado se excede por ${this.formatWeight(exceeded)} gr.`
      );
    }
  }

  private buildQuarteringItem(quartering: any): IQuarteringItemEntity {
    return {
      weight: Number(quartering.weight),
      requiredAnalysisId: quartering.requiredAnalysisId,
      replicatedIndex:
        this.requiredAnalysis().find(a => a.requiredAnalysisId === quartering.requiredAnalysisId)?.replicatedIndex || 0,
      requiresFa: quartering.requiresFa || false
    };
  }

  private appendQuarteringItem(item: IQuarteringItemEntity): void {
    const currentQuarterings = this.subSamplesSignal();
    const newQuarterings = [...currentQuarterings, item];

    this.subSamplesSignal.set(newQuarterings);
    this.form.get('subSamples')?.setValue(newQuarterings);
  }

  private handlePostAddFeedback(newTotal: number): void {
    const received = this.receivedWeight();
    if (newTotal === received) {
      this.toastService.success('¡Cuarteo completado! Se ha utilizado todo el peso de la muestra.');
      this.showResultsModal.set(false);
    } else {
      const remaining = this.formatWeight(received - newTotal);
      this.toastService.success(`Cuarteo agregado. Peso restante: ${remaining} gr`);
    }
  }

  resetAllForms(): void {
    this.subSamplesSignal.set([]);

    this.showResultsModal.set(false);

    this.modalUpdateTrigger.set(0);
  }
}
