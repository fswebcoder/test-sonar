import IShiftEntity from '@/domain/entities/plant/shift/shift.entity';
import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { ICONS } from '@/shared/enums/general.enum';
import IPersonnelPosition from '@/domain/entities/common/personnel-position.entity';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { IAddPersonnelParamsEntity } from '@/domain/entities/plant/shift/add-personel-params.entity';
import IPersonnelEntity, { IPersonnelShiftConfigEntity } from '@/domain/entities/plant/shift/personnel.entity';
import IPersonnelCatalogEntity from '@/domain/entities/common/personnel.entity';
import { IDeleteShiftPersonnelParamsEntity } from '@/domain/entities/plant/shift/delete-shift-personnel-params.entity';
import { PermissionDirective } from '@/core/directives';
import { ECurrentShiftActions } from '@/presentation/modules/plant/modules/actions.enum';
import { DeletePersonnelFormComponent } from '@/presentation/modules/plant/components/delete-personnel-form/delete-personnel-form.component';
import { AddPersonnelFormComponent } from '@/presentation/modules/plant/components/add-personnel-form/add-personnel-form.component';
import { ShiftAreaComponent } from '@/presentation/modules/plant/components/shift-area/shift-area.component';
import { ShiftDescriptionComponent } from '@/presentation/modules/plant/components/shift-description/shift-description.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { TabsComponent } from '@/shared/components/tabs/tabs.component';

@Component({
  selector: 'svi-current-shift-dump',
  imports: [
    ConfirmDialogComponent,
    EmptyStateComponent,
    ButtonComponent,
    ShiftDescriptionComponent,
    ShiftAreaComponent,
    DialogComponent,
    AddPersonnelFormComponent,
    TabsComponent,
    DeletePersonnelFormComponent,
    PermissionDirective
  ],
  templateUrl: './current-shift-dump.component.html',
  styleUrl: './current-shift-dump.component.scss'
})
export class CurrentShiftDumpComponent {
  ICONS = ICONS;

  path = '/planta/turno-actual'
  currentShiftActions = ECurrentShiftActions

  currentShift = input.required<IShiftEntity | null | undefined>();
  personnel = input.required<IPersonnelCatalogEntity[]>();
  personnelPositions = input.required<IPersonnelPosition[]>();

  selectedAreaId = signal<string | null>(null);
  deletePersonnelDialogVisible = signal(false);
  selectedPersonnel = signal<IPersonnelEntity | null>(null);
  areaValueAccessor = (area: NonNullable<IShiftEntity['areasOfOperation']>[number], index: number) => area.name ?? `area-${index}`;

  onOpenShift = output<void>();
  onAddPersonnel = output<IAddPersonnelParamsEntity>();
  onCloseShift = output<void>();
  onDeletePersonnel = output<IDeleteShiftPersonnelParamsEntity>();

  addPersonnelDialogVisible = signal(false);

  @ViewChild('addPersonnelForm') addPersonnelForm!: AddPersonnelFormComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  @ViewChild('deletePersonnelForm') deletePersonnelForm!: DeletePersonnelFormComponent;


  showDialog(message?: string, type?: 'close' | 'open') {
    switch (type) {
      case 'close':
        this.confirmDialog.show(
          message || '¿Está seguro de que desea cerrar el turno?',
          () => this.onCloseShift.emit(),
          () => { }
        );
        break;
      case 'open':
        this.confirmDialog.show(
          message || 'No se encontró un turno abierto, ¿Desea abrir uno nuevo?',
          () => this.onOpenShift.emit(),
          () => { }
        );
        break;
      default:
        return;
    }
  }

  showAddPersonnel = (areaId: string) => {
    this.selectedAreaId.set(areaId);
    this.addPersonnelDialogVisible.set(true);
  };

  showDeletePersonnel = (person: IPersonnelEntity | IPersonnelShiftConfigEntity) => {
    const isConfig = (p: IPersonnelShiftConfigEntity | IPersonnelEntity): p is IPersonnelShiftConfigEntity =>
      'configuredPersonnelShiftId' in p;
    if (!isConfig(person)) {
      this.selectedPersonnel.set(person);
      this.deletePersonnelDialogVisible.set(true);
    }
  };

  deletePersonnel(event: IDeleteShiftPersonnelParamsEntity) {
    this.onDeletePersonnel.emit(event);
  }

  addPersonnel(event: Omit<IAddPersonnelParamsEntity, 'operationAreaId'>) {
    if (!this.selectedAreaId()) return;
    const data: IAddPersonnelParamsEntity = {
      ...event,
      operationAreaId: this.selectedAreaId()!
    };

    this.onAddPersonnel.emit(data);
  }

  clearAndCloseDialog = () => {
    this.addPersonnelDialogVisible.set(false);
    this.deletePersonnelDialogVisible.set(false);
    this.selectedPersonnel.set(null);
    this.selectedAreaId.set(null);
    this.addPersonnelForm.clearForm();
    this.deletePersonnelForm.clearForm();
  };

  currentShiftEffect$ = effect(() => {
    if (this.currentShift() === null) {
      this.showDialog(undefined, 'open');
    } else {
      return;
    }
  });
}
