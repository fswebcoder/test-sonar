import { Component, input, output, signal, ViewChild } from '@angular/core';
import { IShiftConfigEntity } from '@/domain/entities/common/shift.entity';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IAreasOfOperationConfig } from '@/domain/entities/plant/shift/shift.entity';
import { CommonModule } from '@angular/common';
import { EShiftConfigActions } from '@/presentation/modules/plant/modules/actions.enum';
import { DialogComponent } from "@/shared/components/dialog/dialog.component";
import IPersonnelPosition from '@/domain/entities/common/personnel-position.entity';
import IPersonnelCatalogEntity from '@/domain/entities/common/personnel.entity';
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { ICONS } from '@/shared/enums/general.enum';
import { IAddPersonnelShiftConfigParamsEntity } from '@/domain/entities/plant/shift/add-personel-params.entity';
import { ShiftAreaComponent } from '@/presentation/modules/plant/components/shift-area/shift-area.component';
import { AddPersonnelFormComponent } from '@/presentation/modules/plant/components/add-personnel-form/add-personnel-form.component';
import IPersonnelEntity, { IPersonnelShiftConfigEntity } from '@/domain/entities/plant/shift/personnel.entity';
import { ConfirmDialogComponent } from "@/shared/components/confirm-dialog/confirm-dialog.component";
import { IDeleteShiftPersonnelConfigParamsEntity } from '@/domain/entities/plant/shift/delete-shift-personnel-params.entity';
import { TabsComponent } from '@/shared/components/tabs/tabs.component';


@Component({
  selector: 'svi-shift-config-dump',
  imports: [ReactiveFormsModule, SelectButtonModule, TabsComponent, ShiftAreaComponent, CommonModule, DialogComponent, AddPersonnelFormComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './shift-config-dump.component.html',
  styleUrl: './shift-config-dump.component.scss'
})
export class ShiftConfigDumpComponent {

  form!: FormGroup;
  path = '/planta/configuracion-turno'
  currentShiftActions = EShiftConfigActions
  ICONS = ICONS

  shifts = input.required<IShiftConfigEntity[]>();
  currentShift = input.required<IAreasOfOperationConfig[] | null>();
  personnel = input.required<IPersonnelCatalogEntity[]>();
  personnelPositions = input.required<IPersonnelPosition[]>();

  selectedAreaId = signal<string | null>(null);
  addPersonnelDialogVisible = signal(false);
  selectedPersonnel = signal<IPersonnelShiftConfigEntity | null>(null);
  areaValueAccessor = (area: IAreasOfOperationConfig, index: number) => area.name ?? `area-${index}`;

  onShiftChange = output<string>();
  onAddPersonnel = output<IAddPersonnelShiftConfigParamsEntity>();
  onDeletePersonnel = output<IDeleteShiftPersonnelConfigParamsEntity>();

  @ViewChild('addPersonnelForm') addPersonnelForm!: AddPersonnelFormComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  ngOnInit() {
    this.createForm();
    this.listenShiftChanges();
  }

  createForm() {
    this.form = new FormGroup({
      shift: new FormControl(null, [Validators.required])
    });
  }

  showAddPersonnel = (areaId: string) => {
    this.selectedAreaId.set(areaId);
    this.addPersonnelDialogVisible.set(true);
  };

  showDeletePersonnel = (event: IPersonnelShiftConfigEntity | IPersonnelEntity) => {
    const isConfig = (p: IPersonnelShiftConfigEntity | IPersonnelEntity): p is IPersonnelShiftConfigEntity =>
      'configuredPersonnelShiftId' in p;

    if (isConfig(event)) {
      this.selectedPersonnel.set(event);
      this.confirmDialog.show('', () => this.onDeletePersonnel.emit({ id: event.configuredPersonnelShiftId }), () => {});
    }
  };

  addPersonnel(event: Omit<IAddPersonnelShiftConfigParamsEntity, 'operationAreaId'>) {
    if (!this.selectedAreaId()) return;
    const data: IAddPersonnelShiftConfigParamsEntity = {
      ...event,
      operationAreaId: this.selectedAreaId()!
    };

    this.onAddPersonnel.emit(data);
  }

  clearAndCloseForms = () => {
    this.addPersonnelDialogVisible.set(false);
    this.selectedPersonnel.set(null);
    this.addPersonnelForm.clearForm()
  };

  private listenShiftChanges() {
    this.form.get('shift')?.valueChanges.subscribe(value => {
      if (!value) return;
      this.onShiftChange.emit(value);
    });
  }

}
