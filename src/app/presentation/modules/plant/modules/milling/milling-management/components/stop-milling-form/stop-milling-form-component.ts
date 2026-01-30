import IMill from "@/domain/entities/plant/milling/mill.entity";
import IStopMillingParamsEntity from "@/domain/entities/plant/milling/stop-milling-params.entity";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { Component, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";
import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { formatDate } from "@/core/utils/format-date";

@Component({
  selector: "svi-stop-milling-form",
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 py-4">
        <svi-date-piker
          formControlName="stopDate"
          label="Fecha de detención"
          [required]="true"
          [showTime]="true"
        ></svi-date-piker>
        <svi-float-input
          formControlName="reason"
          label="Razón"
          [required]="true"
        ></svi-float-input>
        <div class="flex justify-content-end gap-4 mt-4">
          <svi-button type="button" severity="secondary" [icon]="ICONS.CANCEL" (onClick)="cancel()" label="Cancelar"></svi-button>
          <svi-button type="submit" [icon]="ICONS.SAVE" [disabled]="!form.valid" label="Detener"></svi-button>
        </div>
    </form>
  `,
  imports: [ReactiveFormsModule, FloatInputComponent, ButtonComponent, DatePikerComponent]
})
export default class StopMillingFormComponent {
  form!: FormGroup;
  ICONS = ICONS

  mill = input.required<IMill | null>();
  onStop = output<IStopMillingParamsEntity>();
  onCancel = output<void>();

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      stopDate: new FormControl<Date | null>(new Date(), [Validators.required]),
      reason: new FormControl('', [Validators.required])
    });
  }

  cancel() {
    this.clearForm();
    this.onCancel.emit();
  }

  clearForm() {
    this.form.reset({
      stopDate: new Date(),
      reason: ''
    });
  }

  submit() {
    if (this.form.valid) {
      const stopDateValue = this.form.value.stopDate ? formatDate(this.form.value.stopDate) : formatDate(new Date());
      const data: IStopMillingParamsEntity = {
        shiftInfoId: this.mill()?.infoShiftId ?? '',
        stopDate: stopDateValue,
        reason: this.form.value.reason
      };
      this.onStop.emit(data);
    }
  }
}
