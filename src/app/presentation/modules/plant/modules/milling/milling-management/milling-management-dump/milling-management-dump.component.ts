import IMill from '@/domain/entities/plant/milling/mill.entity';
import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { MillingCardComponent } from '../components/milling-card/milling-card.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { AddBatchFormComponent } from '../components/add-batch-form/add-batch-form.component';
import IPumpEntity from '@/domain/entities/common/pump.entity';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import IBatchEntity from '@/domain/entities/admin/suppliers/batches/batch.entity';
import IAddBatchParamsEntity from '@/domain/entities/plant/milling/add-batch-params.entity';
import IVariable from '@/domain/entities/plant/milling/variable.entity';
import { EditVariableFormComponent } from '../components/edit-variable-form/edit-variable-form.component';
import IEditVariableParamsEntity from '@/domain/entities/plant/milling/edit-variable-params.entity';
import IEquipment from '@/domain/entities/plant/milling/equipments.entity';
import ILocation from '@/domain/entities/plant/milling/location.entity';
import { ConfirmDialogComponent } from "@/shared/components/confirm-dialog/confirm-dialog.component";
import StopMillingFormComponent from '../components/stop-milling-form/stop-milling-form-component';
import IStopMillingParamsEntity from '@/domain/entities/plant/milling/stop-milling-params.entity';
import { EmptyStateComponent } from "@/shared/components/empty-state/empty-state.component";
import { ICONS } from '@/shared/enums/general.enum';
import StartMillingFormComponent from '../components/start-milling-form/start-milling-form.component';
import { IStartMillingParamsEntity } from '@/domain/entities/plant/milling/start-milling-params.entity';
import { TabsComponent } from '@/shared/components/tabs/tabs.component';
import { IIdName } from '@/shared/interfaces/id-name.interface';

type VariableSelectionContext = {
  variable: IVariable;
  equipment: IEquipment;
  location: ILocation;
  mill: IMill;
};

@Component({
  selector: 'svi-milling-management-dump',
  standalone: true,
  imports: [MillingCardComponent, DialogComponent, AddBatchFormComponent, EditVariableFormComponent, ConfirmDialogComponent, StopMillingFormComponent, StartMillingFormComponent, EmptyStateComponent, TabsComponent],
  templateUrl: './milling-management-dump.component.html',
  styleUrl: './milling-management-dump.component.scss'
})
export class MillingManagementDumpComponent {
  ICONS = ICONS

  millings = input.required<IMill[]>();
  pumps = input.required<IPumpEntity[]>();
  suppliers = input.required<IsupplierListResponseEntity[]>();
  mines = input.required<IIdName[]>();
  batches = input.required<IBatchEntity[]>();

  onSupplierIdChanges = output<string>();
  onMineIdChanges = output<string>();
  onSaveBatch = output<IAddBatchParamsEntity>();
  onSaveEditVariable = output<IEditVariableParamsEntity>();
  onStopMilling = output<IStopMillingParamsEntity>();
  onStartMilling = output<IStartMillingParamsEntity>();
  onFinish = output<IMill>();


  isAddBatchModalVisible = signal<boolean>(false);
  isEditVariableModalVisible = signal<boolean>(false);
  isStopMillingModalVisible = signal<boolean>(false);
  isStartMillingModalVisible = signal<boolean>(false);
  selectedMill = signal<IMill | null>(null);
  activeTab = signal<string | null>(null);
  selectedVariable = signal<VariableSelectionContext | null>(null);
  tabValueAccessor = (mill: IMill, index: number) => this.millTabValue(mill, index);

  @ViewChild('addBatchForm') addBatchForm!: AddBatchFormComponent;
  @ViewChild('editVariableForm') editVariableForm!: EditVariableFormComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  @ViewChild(StopMillingFormComponent) stopMillingForm!: StopMillingFormComponent;
  @ViewChild(StartMillingFormComponent) startMillingForm!: StartMillingFormComponent;

  constructor() {
    effect(() => {
      const mills = this.millings() ?? [];
      if (!mills.length) {
        this.activeTab.set(null);
        this.selectedMill.set(null);
        return;
      }

      const values = mills.map((mill, index) => this.millTabValue(mill, index));
      const current = this.activeTab();

      if (!current || !values.includes(current)) {
        this.activeTab.set(values[0]);
        this.selectedMill.set(mills[0]);
      } else {
        const idx = values.indexOf(current);
        this.selectedMill.set(mills[idx]);
      }
    });
  }

  showAddBatchModal(mill: IMill) {
    this.selectedMill.set(mill);
    this.isAddBatchModalVisible.set(true);
  }

  changeSupplierId(supplierId: string) {
    this.onSupplierIdChanges.emit(supplierId);
  }

  changeMineId(mineId: string) {
    this.onMineIdChanges.emit(mineId);
  }

  cancelAddBatch() {
    this.isAddBatchModalVisible.set(false);
    this.selectedMill.set(this.resetSelectedMillToActive());
    this.addBatchForm.clearForm();
  }

  cancelEditVariable() {
    this.isEditVariableModalVisible.set(false);
    this.selectedVariable.set(null);
    this.editVariableForm.clearForm();
    this.selectedMill.set(this.resetSelectedMillToActive());
  }

  cancelStopMilling() {
    this.isStopMillingModalVisible.set(false);
    this.selectedMill.set(this.resetSelectedMillToActive());
    this.stopMillingForm?.clearForm();
  }

  cancelStartMilling() {
    this.isStartMillingModalVisible.set(false);
    this.selectedMill.set(this.resetSelectedMillToActive());
    this.startMillingForm?.clearForm();
  }

  saveBatch(event: Omit<IAddBatchParamsEntity, 'millId'>) {
    const data: IAddBatchParamsEntity = {
      ...event,
      millId: this.selectedMill()?.mill.id ?? ''
    };
    this.onSaveBatch.emit(data);
  }

  saveEditVariable(event: Pick<IEditVariableParamsEntity, 'value' | 'expectedTime'>) {
    const selection = this.selectedVariable();
    if (!selection) return;
    const { equipment, location, variable, mill } = selection;
    const data: IEditVariableParamsEntity = {
      ...event,
      equipmentId: equipment.id,
      locationId: location.id,
      variableId: variable.id,
      shiftInfoId: mill.infoShiftId
    };
    this.onSaveEditVariable.emit(data);
  }

  showEditVariable(selection: VariableSelectionContext) {
    this.selectedVariable.set(selection);
    this.selectedMill.set(selection.mill);
    this.isEditVariableModalVisible.set(true);
  }

  operation(event: { mill: IMill; operation: 'start' | 'stop' | 'finish' | 'add' }) {
    switch (event.operation) {
      case 'start':
        this.selectedMill.set(event.mill);
        this.isStartMillingModalVisible.set(true);
        break;
      case 'stop':
        this.selectedMill.set(event.mill);
        this.isStopMillingModalVisible.set(true);
        break;
      case 'finish':
        this.confirmDialog.show("¿Estás seguro que deseas finalizar la molienda?", () => {
          this.onFinish.emit(event.mill);
        })
        break;
      case 'add':
        this.showAddBatchModal(event.mill);
        break;
    }
  }

  stopMilling(event: IStopMillingParamsEntity) {
    this.onStopMilling.emit(event);
  }

  startMilling(event: IStartMillingParamsEntity) {
    this.onStartMilling.emit(event);
    this.cancelStartMilling();
  }

  onTabChange(value: string | number | null) {
    if (value === null || value === undefined) {
      return;
    }
    const tabValue = value.toString();
    this.activeTab.set(tabValue);
    const mill = this.findMillByTabValue(tabValue);
    if (mill) {
      this.selectedMill.set(mill);
    }
  }

  firstMillTab() {
    const mills = this.millings() ?? [];
    return mills.length ? this.millTabValue(mills[0], 0) : '';
  }

  millTabValue(mill: IMill, index: number) {
    const identifier = mill.mill.id || `idx-${index}`;
    return `mill-${identifier}`;
  }

  private findMillByTabValue(value: string): IMill | null {
    const mills = this.millings() ?? [];
    const index = mills.findIndex((mill, idx) => this.millTabValue(mill, idx) === value);
    return index >= 0 ? mills[index] : null;
  }

  private resetSelectedMillToActive(): IMill | null {
    const current = this.activeTab();
    if (!current) {
      return null;
    }
    return this.findMillByTabValue(current);
  }
}
