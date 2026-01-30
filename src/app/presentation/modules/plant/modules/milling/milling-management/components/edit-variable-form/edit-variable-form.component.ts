import IVariable from '@/domain/entities/plant/milling/variable.entity';
import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { InputNumberComponent } from "@/shared/components/form/input-number/input-number.component";
import IEditVariableParamsEntity from '@/domain/entities/plant/milling/edit-variable-params.entity';
import parseUTCTime from '@/core/utils/parse-UTC-time';

@Component({
  selector: 'svi-edit-variable-form',
  imports: [ReactiveFormsModule, ButtonComponent, FloatSelectComponent, InputNumberComponent],
  template: `<form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-4 py-4">
    @if (hasLastReading()) {
      <p class="text-sm text-color-secondary m-0">
        Última lectura: {{ getLastReadingValue() }} a las {{ getLastReadingTime() }}
      </p>
    }
    <svi-input-number formControlName="value" label="Valor" [decimalPlaces]="4" [decimal]="true" [max]="999999"></svi-input-number>
    <svi-float-select
      formControlName="expectedTime"
      label="Hora"
      [options]="dateOptions"
      optionLabel="label"
      optionValue="value"
    ></svi-float-select>
    <div class="flex justify-content-end gap-4">
      <svi-button type="button" (click)="cancel()" icon="{{ ICONS.CANCEL }}" severity="secondary"
        >Cancelar</svi-button
      >
      <svi-button type="submit" [disabled]="form.invalid" icon="{{ ICONS.SAVE }}" label="Guardar"></svi-button>
    </div>
  </form>`
})
export class EditVariableFormComponent {
  variable = input.required<IVariable | null>();

  onClose = output<void>();
  onSave = output<Pick<IEditVariableParamsEntity, "value" | "expectedTime">>();

  form!: FormGroup;
  ICONS = ICONS;
  dateOptions = this.generateDateOptions();

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = new FormGroup({
      value: new FormControl(null, [Validators.required]),
      expectedTime: new FormControl(null, [Validators.required])
    });
  }
  private generateDateOptions(): { value: string; label: string }[] {
    const now = new Date();
    const options: { value: string; label: string }[] = [];

    const start = new Date(now.getTime() - 120 * 60000);
    const end = new Date(now.getTime() + 120 * 60000);

    start.setMinutes(Math.floor(start.getMinutes() / 30) * 30, 0, 0);

    for (let d = new Date(start.getTime()); d <= end; d.setMinutes(d.getMinutes() + 30)) {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');

      options.push({
        value: d.toISOString(),
        label: `${hh}:${mm}`,
      });
    }

    return options;
  }



  save() {
    const data: Pick<IEditVariableParamsEntity, "value" | "expectedTime"> = {
      value: this.form.value.value,
      expectedTime: this.form.value.expectedTime
    };
    this.onSave.emit(data);
  }
  cancel(){
    this.onClose.emit();
    this.clearForm();
  }

  clearForm() {
    this.form.reset();
  }

  hasLastReading(): boolean {
    return Boolean(this.variable()?.lastReading);
  }

  getLastReadingValue(): string {
    const value = this.variable()?.lastReading?.value;
    if (value === null || value === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(Number(value));
  }

  getLastReadingTime(): string {
    const readingTime = this.variable()?.lastReading?.readingTime;
    if (!readingTime) {
      return '-';
    }
    try {
      const date = parseUTCTime(readingTime);
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '-';
    }
  }
}
