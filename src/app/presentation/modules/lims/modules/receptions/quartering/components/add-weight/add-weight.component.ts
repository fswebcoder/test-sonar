import { Component, inject, input, output, signal, computed, effect, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { IQuarteringItemEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-items.entity';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ToastCustomService } from '@SV-Development/utilities';
import { NgClass } from '@angular/common';
import { IRequiredAnalysisQuarteringEntity } from '@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ERROR_DEFS } from '@/shared/components/form/error-def';
import { ICONS } from '@/shared/enums/general.enum';
import { debounceTime } from 'rxjs';
import {
  InstructionItem,
  InstructionsPanelComponent
} from '@/shared/components/instructions-panel/instructions-panel.component';
import { CheckboxComponent } from "@/shared/components/form/checkbox/checkbox.component";

@Component({
  selector: 'svi-add-weight',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FloatSelectComponent,
    NgClass,
    FloatInputComponent,
    InstructionsPanelComponent,
    CheckboxComponent
],
  templateUrl: './add-weight.component.html',
  styleUrl: './add-weight.component.scss'
})
export class AddWeightComponent implements OnInit {
  ICONS = ICONS;

  @ViewChild('weightInput') weightInputComponent!: FloatInputComponent;

  private fb = inject(FormBuilder);
  private toastService = inject(ToastCustomService);

  form!: FormGroup;

  requiredAnalysis = input.required<IRequiredAnalysisQuarteringEntity[]>();
  existingQuarterings = input<IQuarteringItemEntity[]>([]);
  sampleReceivedWeight = input<number>(0);
  existingSubSamplesWeight = input<number>(0);

  onAddQuartering = output<IQuarteringItemEntity>();
  onCloseModal = output<void>();

  isFormValid = signal(false);

  private lastToastMessage = signal<string>('');


  showRequiresFa = signal(false);

  readonly instructions: InstructionItem[] = [
    {
      icon: ICONS.LAYER_GROUP,
      iconColor: 'text-yellow-500',
      title: 'Define el peso de la submuestra',
      description: 'Ingresa el peso de la submuestra en gramos'
    },
    {
      icon: ICONS.CHECK,
      iconColor: 'text-green-500',
      title: 'Selecciona el análisis',
      description: 'Elige el análisis que se realizará en la submuestra'
    }
  ];

  weightErrorMessages = ERROR_DEFS['weight'];

  availableAnalysis = computed(() => {
    const all = this.requiredAnalysis();
    const usedIds = this.existingQuarterings().map(q => q.requiredAnalysisId);
    return all.filter(a => !usedIds.includes(a.requiredAnalysisId));
  });

  totalQuarteringWeight = computed(() => {
    const quarterings = this.existingQuarterings();
    const total = quarterings.reduce((sum, q) => sum + (q.weight || 0), 0);
    return total + this.existingSubSamplesWeight();
  });

  availableWeight = computed(() => {
    return this.sampleReceivedWeight() - this.totalQuarteringWeight();
  });

  ngOnInit() {
    this.initForm();
    this.setupEffects();
  }

  private initForm() {
    this.createForm()

    this.listenRequiredAnalysisChanges();

    this.form.valueChanges.subscribe(() => {
      this.validateForm();
    });
    
    this.listenWeightChanges();
  }

  private listenWeightChanges() {
    this.form.get('weight')?.valueChanges.pipe(debounceTime(300)).subscribe(weight => {
      this.validateWeightInput(weight);
    });
  }

  private listenRequiredAnalysisChanges() {
    this.form.get('requiredAnalysisId')!.valueChanges.subscribe(id => {
      const analysis = this.requiredAnalysis().find(a => a.requiredAnalysisId === id);
      const matches = !!analysis && JSON.stringify(analysis).toLowerCase().includes('retalla');
      this.showRequiresFa.set(matches);
    });
  }

  private createForm(){
    this.form = this.fb.group({
      weight: new FormControl(null, [Validators.required, Validators.min(0.1)]),
      requiredAnalysisId: new FormControl(null, [Validators.required]),
      requiresFa: new FormControl(false)
    });
  }

  private setupEffects() {
    effect(() => {
      const selectedId = this.form.get('requiredAnalysisId')?.value;
      const available = this.availableAnalysis();
      const isValid = available.some(a => a.requiredAnalysisId === selectedId);
      if (selectedId && !isValid) {
        this.form.get('requiredAnalysisId')?.setValue(null, { emitEvent: false });
      }
    });
  }

  private validateForm() {
    const weight = this.form.get('weight')?.value;
    const analysisId = this.form.get('requiredAnalysisId')?.value;
    const available = this.availableWeight();
    const isValid = this.form.valid && weight > 0 && weight <= available && !!analysisId;
    this.isFormValid.set(isValid);
  }

  private validateWeightInput(weight: number | null) {
    if (!weight || weight <= 0) return;

    const available = this.availableWeight();

    if (weight > available) {
      const message = `El peso del cuarteo no puede superar el peso disponible (${available}g)`;

      if (this.lastToastMessage() !== message) {
        this.toastService.error(message);
        this.lastToastMessage.set(message);

        setTimeout(() => {
          this.lastToastMessage.set('');
        }, 3000);
      }
    }

    this.validateForm();
  }

  addQuartering() {
    if (!this.isFormValid()) {
      this.toastService.error('El formulario no es válido');
      return;
    }

    const weight = this.form.get('weight')?.value;
    const requiresFa = this.form.get('requiresFa')?.value;
    const analysisId = this.form.get('requiredAnalysisId')?.value;
    const analysis = this.requiredAnalysis().find(a => a.requiredAnalysisId === analysisId);
    if (!analysis) {
      this.toastService.error('Análisis no válido');
      return;
    }

    this.onAddQuartering.emit({
       weight,
      requiredAnalysisId: analysisId,
      replicatedIndex: analysis.replicatedIndex,
      requiresFa
    });
    this.clearFormCompletely();

    const newTotal = this.totalQuarteringWeight() + weight;
    if (newTotal === this.sampleReceivedWeight()) {
      this.toastService.success('¡Cuarteo completado! Se ha utilizado todo el peso de la muestra.');
    }
  }

  closeModal() {
    this.clearFormCompletely();
    this.onCloseModal.emit();
  }

  private clearFormCompletely() {
    this.form.reset({
      requiresFa: false
    });
    this.isFormValid.set(false);
    this.lastToastMessage.set('');
  }
}
