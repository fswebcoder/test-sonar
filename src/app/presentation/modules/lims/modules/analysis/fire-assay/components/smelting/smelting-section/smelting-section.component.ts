import IFurnaceEntity from '@/domain/entities/lims/furnaces/furnace.entity';
import { Component, effect, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { IStartSmeltingParams } from '@/domain/entities/lims/analysis/fire-assay/start-smelting-params.entity';
import { IFinishSmeltingParams } from '@/domain/entities/lims/analysis/fire-assay/finish-smelting-params.entity';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ERROR_DEFS } from '@/shared/components/form/error-def';
import { SmeltingGridComponent } from '../smelting-grid/smelting-grid.component';
import { SmeltingWeightPanelComponent } from '../smelting-weight-panel/smelting-weight-panel.component';
import { SmeltingScanDialogComponent } from '../smelting-scan-dialog/smelting-scan-dialog.component';
import { SmeltingSetupFormComponent } from '../smelting-setup-form/smelting-setup-form.component';
import { SmeltingStartActionComponent } from '../smelting-start-action/smelting-start-action.component';
@Component({
  selector: 'svi-smelting-section',
  templateUrl: './smelting-section.component.html',
  styleUrls: ['./smelting-section.component.scss'],
  imports: [
    ReactiveFormsModule,
    SmeltingSetupFormComponent,
    SmeltingGridComponent,
    SmeltingWeightPanelComponent,
    SmeltingScanDialogComponent,
    SmeltingStartActionComponent
  ]
})
export class SmeltingSectionComponent implements OnChanges {
  furnaces = input.required<IFurnaceEntity[]>();
  furnaceActivity = input<{
    fireAssayId: string;
    rows: number;
    columns: number;
    smeltingFurnaceId: string;
    smeltingStatus: string;
    fireAssayDetail: Array<{
      sampleId: string;
      sampleCode: string;
      regulusWeight: number;
      row: number;
      column: number;
    }>;
  } | null>(null);
  clearKey = input<number>(0);

  onFurnaceChange = output<string>();
  onStartSmelting = output<Pick<IStartSmeltingParams, 'furnaceId' | 'rows' | 'columns' | 'sampleCodes'>>();
  onFinishSmelting = output<IFinishSmeltingParams>();

  rows = signal<number>(0);
  columns = signal<number>(0);
  samples = signal<(string | null)[]>([]);
  sampleIds = signal<(string | null)[]>([]);
  weightMode = signal<boolean>(false);
  regulusWeights = signal<(number | null)[]>([]);
  finishedSmelting = signal<boolean>(false);

  scanDialogVisible = signal<boolean>(false);
  selectedCellIndex = signal<number | null>(null);
  scanForm!: FormGroup;
  weightForm!: FormGroup;

  form!: FormGroup;
  errorDefs = ERROR_DEFS;

  ROWS_ERROR = this.errorDefs['rows'];
  COLUMNS_ERROR = this.errorDefs['columns'];

  ngOnInit() {
    this.createForm();
    this.createScanForm();
    this.createWeightForm();
    this.listenFurnaceChange();
    effect(() => {
      this.applyActivity(this.furnaceActivity());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['furnaceActivity']) {
      this.applyActivity(this.furnaceActivity());
    }
    if (changes['clearKey']) {
      this.handleClearKeyChange();
    }
  }

  private applyActivity(act: any) {
    if (!this.form) return;
    act ? this.setActivity(act) : this.clearActivity();
  }

  private setActivity(act: any) {
    this.weightMode.set(true);
    const status = (act.smeltingStatus || '').toString().toUpperCase();
    this.finishedSmelting.set(status === 'FINISHED');
    this.patchGridSize(act.rows, act.columns, true);
    const { codes, ids, weights } = this.extractDetails(act);
    this.rows.set(act.rows);
    this.columns.set(act.columns);
    this.samples.set(codes);
    this.sampleIds.set(ids);
    this.regulusWeights.set(weights);
    this._fireAssayId = act.fireAssayId;
  }

  private clearActivity() {
    this.weightMode.set(false);
    this.finishedSmelting.set(false);
    this.patchGridSize(0, 0, false);
    this.samples.set([]);
    this.sampleIds.set([]);
    this.regulusWeights.set([]);
    this.rows.set(0);
    this.columns.set(0);
    this._fireAssayId = null;
  }

  private _lastClearKey: number | null = null;
  private handleClearKeyChange() {
    const current = this.clearKey();
    if (this._lastClearKey === null) { this._lastClearKey = current; return; }
    if (current !== this._lastClearKey) {
      this._lastClearKey = current;
      this.fullReset();
    }
  }

  private fullReset() {
    if (this.form) {
      this.form.reset();
      this.form.get('rows')?.enable({ emitEvent: false });
      this.form.get('columns')?.enable({ emitEvent: false });
    }
    this.scanDialogVisible.set(false);
    this.selectedCellIndex.set(null);
    this.clearActivity();
  }

  private patchGridSize(rows: number, cols: number, disable: boolean) {
    const rCtrl = this.form.get('rows');
    const cCtrl = this.form.get('columns');
    rCtrl?.setValue(rows);
    cCtrl?.setValue(cols);
    if (disable) {
      rCtrl?.disable({ emitEvent: false });
      cCtrl?.disable({ emitEvent: false });
    } else {
      rCtrl?.enable({ emitEvent: false });
      cCtrl?.enable({ emitEvent: false });
    }
  }

  private extractDetails(act: any) {
    const total = act.rows * act.columns;
    const codes: (string | null)[] = Array.from({ length: total }, () => null);
    const ids: (string | null)[] = Array.from({ length: total }, () => null);
    const weights: (number | null)[] = Array.from({ length: total }, () => null);
    const details = act?.fireAssayDetail || act?.FireAssayDetail || [];
    for (const d of details) {
      const r0 = Math.max(0, d.row - 1);
      const c0 = Math.max(0, d.column - 1);
      const idx = r0 * act.columns + c0;
      if (idx >= 0 && idx < total) {
        codes[idx] = d.sampleCode;
        ids[idx] = d.sampleId;
        weights[idx] = d.regulusWeight ?? null;
      }
    }
    return { codes, ids, weights };
  }

  private _fireAssayId: string | null = null;

  onWeightCell(evt: { row: number; col: number; value: string }) {
    this.onEditCell(evt);
  }

  createGrid() {
    if (this.weightMode()) return;
    this.columns.set(this.form.get('columns')?.value);
    this.rows.set(this.form.get('rows')?.value);
    const total = (this.rows() || 0) * (this.columns() || 0);
    this.samples.set(Array.from({ length: total }, () => null));
    this.regulusWeights.set(Array.from({ length: total }, () => null));
  }

  private listenFurnaceChange() {
    this.form.get('furnaceId')?.valueChanges.subscribe(value => {
      if (!value) return;
      this.onFurnaceChange.emit(value);
    });
  }

  private readonly createForm = () => {
    this.form = new FormGroup({
      furnaceId: new FormControl(null, [Validators.required]),
      rows: new FormControl(null, [Validators.required, Validators.max(5)]),
      columns: new FormControl(null, [Validators.required, Validators.max(5)]),
      sampleIds: new FormControl([])
    });
  };

  onCellSelected(evt: { row: number; col: number }) { if (this.weightMode() || this.finishedSmelting()) return; this.openSampleDialog(evt.row, evt.col, null); }
  onEditCell(evt: { row: number; col: number; value: string }) { if (this.finishedSmelting()) return; this.weightMode() ? this.openWeightDialog(evt.row, evt.col) : this.openSampleDialog(evt.row, evt.col, evt.value); }
  private openSampleDialog(row: number, col: number, value: string | null) { const idx = row * this.columns() + col; this.selectedCellIndex.set(idx); this.scanForm.reset({ sampleCode: value }); this.scanDialogVisible.set(true); }
  private openWeightDialog(row: number, col: number) { const idx = row * this.columns() + col; this.selectedCellIndex.set(idx); const currentWeight = this.regulusWeights()[idx] === 0 ? null : this.regulusWeights()[idx]; this.weightForm.reset({ regulusWeight: currentWeight }); this.scanDialogVisible.set(true); }

  onDeleteCell(evt: { row: number; col: number }) {
    const idx = evt.row * this.columns() + evt.col;
    const current = this.samples().slice();
    current[idx] = null;
    this.samples.set(current);
  }

  confirmScan() { this.weightMode() ? this.applyWeightScan() : this.applyCodeScan(); this.closeScanDialog(); }

  private applyWeightScan() {
    const idx = this.selectedCellIndex();
    if (idx === null) return;
    const raw = this.weightForm.get('regulusWeight')?.value;
    const weight = raw === null || raw === undefined || raw === '' ? null : Number(raw);
    if (weight === null || Number.isNaN(weight)) return;
    const clone = this.regulusWeights().slice();
    clone[idx] = weight;
    this.regulusWeights.set(clone);
  }

  private applyCodeScan() {
    const idx = this.selectedCellIndex();
    if (idx === null) return;
    const val: string | null = (this.scanForm.get('sampleCode')?.value || '').trim() || null;
    if (!val) return;
    const clone = this.samples().slice();
    clone[idx] = val;
    this.samples.set(clone);
  }


  private closeScanDialog() { this.scanDialogVisible.set(false); this.selectedCellIndex.set(null); this.scanForm.reset(); this.weightForm.reset(); }

  getAssignedCount(): number {
    const s = this.samples();
    const w = this.regulusWeights();
    let c = 0;
    for (let i = 0; i < s.length; i++) {
      const weight = w[i];
      if (s[i] && typeof weight === 'number' && weight > 0) c++;
    }
    return c;
  }

  getTotalSamples(): number {
    return this.samples().filter(v => !!v).length;
  }

  allAssigned(): boolean {
    if (!this.weightMode()) return false;
    const total = this.getTotalSamples();
    if (total === 0) return false;
    return this.getAssignedCount() === total;
  }

  finishSmelting() {
    if (!this.weightMode() || !this._fireAssayId) return;
    const payload = this.buildFinishPayload();
    if (!payload) return;
    this.onFinishSmelting.emit({ fireAssayId: this._fireAssayId, samples: payload });
  }

  private buildFinishPayload(): { sampleId: string; regulusWeight: number }[] | null {
    const out: { sampleId: string; regulusWeight: number }[] = [];
    const codes = this.samples();
    const ids = this.sampleIds();
    const weights = this.regulusWeights();
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      if (!code) continue;
      const id = ids[i];
      const w = weights[i];
      if (!id || w === null || w === undefined || w === 0) return null;
      out.push({ sampleId: id, regulusWeight: w });
    }
    return out.length ? out : null;
  }

  cancelScan() { this.scanDialogVisible.set(false); }

  onScanDialogVisibleChange(v: boolean) {
    this.scanDialogVisible.set(v);
    if (!v) this.onScanDialogClose();
  }

  onScanDialogClose() { this.selectedCellIndex.set(null); }

  saveSamples() {
    if (this.weightMode()) {
      this.form.get('sampleIds')?.setValue(this.samples());
      if (!this.form.get('regulusWeights')) {
        this.form.addControl('regulusWeights', new FormControl([]));
      }
      this.form.get('regulusWeights')?.setValue(this.regulusWeights());
    } else {
      const ids = this.samples().filter((s): s is string => !!s && s.trim().length > 0);
      this.form.get('sampleIds')?.setValue(ids);
    }
  }

  startSmelting() {
    if (this.weightMode()) return;
    const furnaceId: string | null = this.form.get('furnaceId')?.value;
    const rows: number | null = this.form.get('rows')?.value;
    const columns: number | null = this.form.get('columns')?.value;
    if (!furnaceId || !rows || !columns) return;
    const sampleCodes: string[] = this.samples().filter((s): s is string => !!s && s.trim().length > 0);
    if (sampleCodes.length === 0) return;
    this.onStartSmelting.emit({ furnaceId, rows, columns, sampleCodes });
  }

  private createScanForm() { this.scanForm = new FormGroup({ sampleCode: new FormControl<string | null>(null, [Validators.required]) }); }
  private createWeightForm() {
    this.weightForm = new FormGroup({
      regulusWeight: new FormControl<number | "">("",
        [Validators.required, Validators.min(0.001)]
      )
    });
  }

  clearGrid() {
    if (this.weightMode()) return;
    this.rows.set(0);
    this.columns.set(0);
    this.samples.set([]);
    this.regulusWeights.set([]);
    this.finishedSmelting.set(false);
    this.form.get('rows')?.reset();
    this.form.get('columns')?.reset();
  }
}
