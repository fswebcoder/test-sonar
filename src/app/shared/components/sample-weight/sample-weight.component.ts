import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-sample-weight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatInputComponent, ButtonComponent],
  templateUrl: './sample-weight.component.html',
  styleUrls: ['./sample-weight.component.scss']
})
export class SampleWeightComponent {
  tare = input<number | null>(null);
  weight = input<number | null>(null);
  ICONS = ICONS;
  disableWeight = input<boolean>(true);
  readWeightDisabled = input<boolean | null>(null);
  disableTare = input<boolean>(true);
  weightControl = input<FormControl<number | null> | null>(null);
  tareControl = input<FormControl<number | null> | null>(null);

  private readonly internalWeightControl = signal(new FormControl<number | null>({ value: null, disabled: false }));
  private readonly internalTareControl = signal(new FormControl<number | null>({ value: null, disabled: false }));
  private readonly manualWeightValue = signal<number | null>(null);

  weightFormControl = computed(() => this.weightControl() ?? this.internalWeightControl());
  tareFormControl = computed(() => this.tareControl() ?? this.internalTareControl());

  canEditWeight = computed(() => !this.disableWeight());
  canEditTare = computed(() => !this.disableTare());
  isReadWeightDisabled = computed(() => this.readWeightDisabled() ?? this.disableWeight());
  displayWeight = computed(() => this.weight() ?? this.manualWeightValue());
  showWeightSection = computed(() => {
    const hasExternalReadState = this.readWeightDisabled() !== null;
    return this.displayWeight() !== null || this.canEditWeight() || hasExternalReadState;
  });
  canShowManualInput = computed(() => this.canEditWeight());
  showTareSection = computed(() => this.tare() !== null || this.canEditTare());

  onReadWeight = output<void>();
  onReadTareWeight = output<void>();
  onManualWeightChange = output<number | null>();
  onManualTareChange = output<number | null>();

  private syncWeight = effect(() => {
    const ctrl = this.weightFormControl();
    const value = this.weight();
    const manualMode = !this.disableWeight();
    
    if (value === null && ctrl.value !== null) {
      ctrl.setValue(null, { emitEvent: false });
      this.manualWeightValue.set(null);
    } else if (!manualMode && ctrl.value !== value) {
      ctrl.setValue(value, { emitEvent: false });
    }
    
    this.updateControlDisabledState(ctrl, this.disableWeight());
  });

  private syncTare = effect(() => {
    const ctrl = this.tareFormControl();
    const value = this.tare();
    if (ctrl.value !== value) {
      ctrl.setValue(value, { emitEvent: false });
    }
    this.updateControlDisabledState(ctrl, this.disableTare());
  });

  private weightValueChanges = effect(onCleanup => {
    const ctrl = this.weightFormControl();
    this.manualWeightValue.set(ctrl.value ?? null);
    const sub = ctrl.valueChanges.subscribe(value => {
      const normalized = value ?? null;
      this.manualWeightValue.set(normalized);
      if (!this.disableWeight()) {
        this.onManualWeightChange.emit(normalized);
      }
    });
    onCleanup(() => sub.unsubscribe());
  });

  private tareValueChanges = effect(onCleanup => {
    const ctrl = this.tareFormControl();
    const sub = ctrl.valueChanges.subscribe(value => {
      if (!this.disableTare()) {
        this.onManualTareChange.emit(value ?? null);
      }
    });
    onCleanup(() => sub.unsubscribe());
  });

  handleReadWeight(): void {
    if (this.isReadWeightDisabled()) return;
    this.onReadWeight.emit();
  }

  handleReadTare(): void {
    if (this.disableTare()) return;
    this.onReadTareWeight.emit();
  }

  private updateControlDisabledState(control: FormControl, disabled: boolean): void {
    if (disabled && control.enabled) {
      control.disable({ emitEvent: false });
    } else if (!disabled && control.disabled) {
      control.enable({ emitEvent: false });
    }
  }
}
