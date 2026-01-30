import IPersonnelEntity from "@/domain/entities/plant/shift/personnel.entity";
import { Component, effect, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";
import { IDeleteShiftPersonnelParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";

@Component({
  selector: "svi-delete-personnel-form",
  template: `
    <form class="flex flex-col gap-4 py-4" [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="hidden" [formControlName]="'id'" />
      <div>
        <svi-float-input label="Motivo"  id="observation" [formControlName]="'observation'"></svi-float-input>
      </div>
      <div class="flex justify-content-end gap-2">
        <svi-button type="button" severity="secondary" icon="{{ ICONS.CANCEL }}" (click)="cancel()" label="Cancelar"></svi-button>
        <svi-button type="submit" [disabled]="form.invalid" icon="{{ ICONS.TRASH }}" label="Eliminar"></svi-button>
      </div>
    </form>
  `,
  imports: [FloatInputComponent, ReactiveFormsModule, ButtonComponent]
})
export class DeletePersonnelFormComponent {
  form!: FormGroup;
  ICONS = ICONS

  person = input.required<IPersonnelEntity | null>();
  isConfig = input<boolean>(false);

  onDeletePersonnel = output<IDeleteShiftPersonnelParamsEntity>();
  onClose = output<void>();

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      observation: new FormControl("", [Validators.required])
    });
  }

  clearForm() {
    this.form.reset();
  }

  onSubmit() {
    if (this.form.valid) {
      this.onDeletePersonnel.emit(this.form.value);
    }
  }

  cancel() {
    this.clearForm();
    this.onClose.emit();
  }

  personEffect$ = effect(() => {
    const person = this.person();
    if (person) {
      this.form.patchValue({
        id: person.personnelShiftId,
        observation: ""
      });
    }
  });
}
