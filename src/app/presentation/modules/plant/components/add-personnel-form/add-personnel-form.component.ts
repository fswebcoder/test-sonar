import IPersonnelPosition from '@/domain/entities/common/personnel-position.entity';
import IPersonnelEntity from '@/domain/entities/common/personnel.entity';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteComponent } from '@/shared/components/form/auto-complete/auto-complete.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { DatePikerComponent } from '@/shared/components/form/date-piker/date-piker.component';
import { formatDate } from '@/core/utils/format-date';
import { IAddPersonnelParamsEntity, IAddPersonnelShiftConfigParamsEntity } from '@/domain/entities/plant/shift/add-personel-params.entity';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-add-personnel-form',
  standalone: true,
  imports: [ReactiveFormsModule, AutoCompleteComponent, FloatSelectComponent, DatePikerComponent, ButtonComponent],
  templateUrl: './add-personnel-form.component.html'
})
export class AddPersonnelFormComponent {
  onClose = output<void>();
  onAddPersonnel = output<Omit<IAddPersonnelParamsEntity, 'operationAreaId'>>();
  onAddPersonnelConfig = output<Omit<IAddPersonnelShiftConfigParamsEntity, 'operationAreaId'>>();

  personnel = input.required<IPersonnelEntity[]>();
  personnelPositions = input.required<IPersonnelPosition[]>();
  areaOfOperationId = input.required<string | null>();
  isConfig = input<boolean>(false);
  shiftConfigId = input<string | null>(null);

  filteredPersonnel: IPersonnelEntity[] = [];
  filteredPersonnelPositions = signal<IPersonnelPosition[]>([]);

  form!: FormGroup;
  ICONS = ICONS;

  ngOnInit(): void {
    this.form = new FormGroup({
      personnelId: new FormControl<string | null>(null, [Validators.required]),
      positionId: new FormControl<string | null>(null, [Validators.required]),
      startDateConfig: new FormControl<Date | null>(null),
      endDateConfig: new FormControl<Date | null>(null),
    });
    this.filteredPersonnel = this.personnel();
    this.filteredPersonnelPositions.set(this.personnelPositions().filter(p => p.operationAreaId === this.areaOfOperationId()));

    if (this.isConfig()) {
      this.form.get('startDateConfig')?.addValidators([Validators.required]);
      this.form.get('endDateConfig')?.addValidators([Validators.required]);
      this.form.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    
    if (this.isConfig()) {
      const payload: Omit<IAddPersonnelShiftConfigParamsEntity, 'operationAreaId'> = {
        personnelId: formData.personnelId!,
        positionId: formData.positionId!,
        startDateConfig: formatDate(formData.startDateConfig as Date),
        endDateConfig: formatDate(formData.endDateConfig as Date),
        shiftConfigId: this.shiftConfigId()!,
      };
      this.onAddPersonnelConfig.emit(payload);
    } else {
      const payload: Omit<IAddPersonnelParamsEntity, 'operationAreaId'> = {
        personnelId: formData.personnelId!,
        positionId: formData.positionId!,
      };
      this.onAddPersonnel.emit(payload);
    }
  }

  clearForm() {
    this.form.reset();
  }

  complete(e: { query: string }) {
    const q = (e?.query ?? '').toLowerCase();
    const all = this.personnel() ?? [];
    const results = q ? all.filter(p => `${p.name} ${p.lastName}`.toLowerCase().includes(q)) : all;
    this.filteredPersonnel = results.map(p => ({
      ...p,
      fullName: `${p.name} ${p.lastName}`
    }));
  }

  areaOfOperationEffect$ = effect(() => {
    this.filteredPersonnelPositions.set(this.personnelPositions().filter(p => p.operationAreaId === this.areaOfOperationId()));
  });
}
