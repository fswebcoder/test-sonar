import IMill from "@/domain/entities/plant/milling/mill.entity";
import { IStartMillingParamsEntity } from "@/domain/entities/plant/milling/start-milling-params.entity";
import { formatDate } from "@/core/utils/format-date";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { Component, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ICONS } from "@/shared/enums/general.enum";

@Component({
  selector: "svi-start-milling-form",
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 py-4">
      <svi-date-piker
        formControlName="restartDate"
        label="Fecha de inicio"
        [required]="true"
        [showTime]="true"
      ></svi-date-piker>

      <div class="flex justify-content-end gap-4 mt-4">
        <svi-button type="button" severity="secondary" [icon]="ICONS.CANCEL" (onClick)="cancel()" label="Cancelar"></svi-button>
        <svi-button type="submit" [icon]="ICONS.PLAY" [disabled]="!form.valid" label="Iniciar"></svi-button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, DatePikerComponent, ButtonComponent]
})
export default class StartMillingFormComponent {
  form!: FormGroup;
  readonly ICONS = ICONS;

  mill = input.required<IMill | null>();
  onStart = output<IStartMillingParamsEntity>();
  onCancel = output<void>();

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = new FormGroup({
      restartDate: new FormControl<Date | null>(new Date(), [Validators.required])
    });
  }

  clearForm(): void {
    this.form.reset({
      restartDate: new Date()
    });
  }

  cancel(): void {
    this.clearForm();
    this.onCancel.emit();
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const restartDateValue = this.form.value.restartDate ? formatDate(this.form.value.restartDate) : formatDate(new Date());

    const data: IStartMillingParamsEntity = {
      shiftInfoId: this.mill()?.infoShiftId ?? "",
      restartDate: restartDateValue
    };

    this.onStart.emit(data);
  }
}
