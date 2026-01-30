import IFurnaceEntity from "@/domain/entities/lims/furnaces/furnace.entity";
import { Component, input, output, signal, computed } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ISmeltingActivityData } from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-response.entity";
import { SmeltingGridComponent } from '../../smelting/smelting-grid/smelting-grid.component';
import { SmeltingScanDialogComponent } from '../../smelting/smelting-scan-dialog/smelting-scan-dialog.component';
import { CupellationWeightPanelComponent } from '../cupellation-weight-panel/cupellation-weight-panel.component';
import { EWeightUnits } from "@/shared/enums/weight-units.enum";

@Component({
  selector: 'svi-cupellation-section',
  standalone: true,
  templateUrl: './cupellation-section.component.html',
  imports: [ReactiveFormsModule, FloatSelectComponent, SmeltingGridComponent, ButtonComponent, SmeltingScanDialogComponent, CupellationWeightPanelComponent]
})
export class CupellationSectionComponent {
  furnaces= input.required<IFurnaceEntity[]>()
  finishedSmeltings = input.required<ISmeltingActivityData[]>()
  activeCupellation = input<ISmeltingActivityData | null>(null)
  
  clearKey = input<number>(0);

  onFurnaceChange = output<string>()
  onStartCupellation = output<{ furnaceId: string; fireAssayId: string }>()
  onFinishCupellation = output<{ fireAssayId: string; samples: { sampleId: string; doreWeight: number }[] }>()

  form!: FormGroup
  EWeightUnits = EWeightUnits;

  rows = signal<number>(0);
  columns = signal<number>(0);
  samples = signal<(string | null)[]>([]);
  weights = signal<(number | null)[]>([]);
  sampleIds = signal<(string | null)[]>([]);
  doreWeights = signal<(number | null)[]>([]);
  finishingMode = signal<boolean>(false);
  weightDialogVisible = signal<boolean>(false);
  selectedCellIndex = signal<number | null>(null);
  doreWeightForm!: FormGroup;
  finishedSmeltingOptions = computed(() => this.finishedSmeltings().map(smelting => {
    let displayDate = smelting.fireAssayId;
    if (smelting.date) {
      const d = new Date(smelting.date);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        displayDate = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
      }
    }
    return { ...smelting, displayDate };
  }));

  getRowIndices(): number[] { return Array.from({length: this.rows()}, (_,i)=>i); }
  getColIndices(): number[] { return Array.from({length: this.columns()}, (_,i)=>i); }

  ngOnInit() {
    this.createForm();
  this.createDoreWeightForm();
    this.listenFurnaceChange()
    this.listenSmeltingSelection();
    
    const act = this.activeCupellation();
    if(act) {
      this.applyActiveCupellation(act);
    }
  }

  private createDoreWeightForm(){
    this.doreWeightForm = new FormGroup({ doreWeight: new FormControl<number | null>(null,[Validators.required, Validators.min(0.0001)]) });
  }

  ngOnChanges(){
    const act = this.activeCupellation();
    if(act){ this.applyActiveCupellation(act); }
    
    this.handleClearKeyChange();
  }

  private _lastClearKey: number | null = null;
  private handleClearKeyChange(){
    const current = this.clearKey();
    if(this._lastClearKey === null){ this._lastClearKey = current; return; }
    if(current !== this._lastClearKey){
      this._lastClearKey = current;
      this.fullReset();
    }
  }

  private createForm() {
    this.form = new FormGroup({
      furnaceId: new FormControl(null, [Validators.required]),
      smeltingToFinish: new FormControl<string | null>(null)
    });
  }

  private listenFurnaceChange() {
    this.form.get('furnaceId')?.valueChanges.subscribe((furnaceId) => {
      if(!furnaceId) return
      this.onFurnaceChange.emit(furnaceId);
    });
  }

  private listenSmeltingSelection(){
    this.form.get('smeltingToFinish')?.valueChanges.subscribe((fireAssayId:string|null)=>{
      if(!fireAssayId){
        this.rows.set(0); this.columns.set(0); this.samples.set([]); this.weights.set([]); return;
      }
      const match = this.finishedSmeltings().find(smelting=>smelting.fireAssayId===fireAssayId);
      if(!match){ this.rows.set(0); this.columns.set(0); this.samples.set([]); this.weights.set([]); return; }
      this.populateFromActivity(match);
    });
  }

  private populateFromActivity(act: ISmeltingActivityData){
    const total = act.rows * act.columns;
    const codes: (string|null)[] = Array.from({length: total}, ()=>null);
    const weights: (number|null)[] = Array.from({length: total}, ()=>null);
    const ids: (string|null)[] = Array.from({length: total}, ()=>null);
    for(const d of act.fireAssayDetail){
      const r0 = Math.max(0,d.row-1);
      const c0 = Math.max(0,d.column-1);
      const idx = r0*act.columns + c0;
      if(idx>=0 && idx<total){
        codes[idx] = d.sampleCode;
        weights[idx] = d.regulusWeight ?? null;
        ids[idx] = (d as any).sampleId ?? null;
      }
    }
    this.rows.set(act.rows);
    this.columns.set(act.columns);
    this.samples.set(codes);
    this.weights.set(weights);
    this.sampleIds.set(ids);
  }
  private applyActiveCupellation(act: ISmeltingActivityData){
  this.populateFromActivity(act);
  
  const ctrl = this.form.get('smeltingToFinish');
  ctrl?.setValue(act.fireAssayId, { emitEvent: false });
  
  ctrl?.disable({emitEvent:false});
  this.finishingMode.set(true);
  const ids = this.sampleIds();
  this.doreWeights.set(ids.map(id=> id ? null : null));
  }

  private fullReset(){
    
    if(this.form){
      this.form.reset();
      
      this.form.get('smeltingToFinish')?.enable({emitEvent:false});
    }
    this.rows.set(0);
    this.columns.set(0);
    this.samples.set([]);
    this.weights.set([]);
    this.sampleIds.set([]);
    this.doreWeights.set([]);
    this.finishingMode.set(false);
    this.weightDialogVisible.set(false);
    this.selectedCellIndex.set(null);
  }
  startCupellation(){
    const furnaceId: string | null = this.form.get('furnaceId')?.value;
    const fireAssayId: string | null = this.form.get('smeltingToFinish')?.value;
    if(!furnaceId || !fireAssayId) return;
    if(this.finishingMode()) {
      const payload = this.buildFinishCupellationPayload();
      if(!payload) return;
      this.onFinishCupellation.emit({ fireAssayId, samples: payload });
    } else {
      this.onStartCupellation.emit({ furnaceId, fireAssayId });
    }
  }

  updateDoreWeight(index: number, value: string){
    const v = value === '' ? null : Number(value);
    const clone = this.doreWeights().slice();
    clone[index] = (v===null || Number.isNaN(v))? null : v;
    this.doreWeights.set(clone);
  }

  onDoreWeightCell(evt: { row: number; col: number; value: string }) {
    if(!this.finishingMode()) return;
    const idx = evt.row * this.columns() + evt.col;
    this.selectedCellIndex.set(idx);
  const current = this.doreWeights()[idx];
  this.doreWeightForm.reset({ doreWeight: current });
    this.weightDialogVisible.set(true);
  }

  onWeightDialogVisibleChange(v:boolean){
    this.weightDialogVisible.set(v);
    if(!v) this.selectedCellIndex.set(null);
  }

  cancelWeightDialog(){
    this.weightDialogVisible.set(false);
  }

  confirmWeightDialog(){
    const idx = this.selectedCellIndex();
    if(idx===null) { this.cancelWeightDialog(); return; }
  const raw = this.doreWeightForm.get('doreWeight')?.value;
    const weight = raw===null || raw===undefined || raw==='' ? null : Number(raw);
    if(weight===null || Number.isNaN(weight) || weight<=0){ this.cancelWeightDialog(); return; }
    const clone = this.doreWeights().slice();
    clone[idx] = weight;
    this.doreWeights.set(clone);
    this.cancelWeightDialog();
  }

  getAssignedDoreCount(): number {
    return this.doreWeights().filter(w => typeof w === 'number' && (w as number) > 0).length;
  }

  getTotalSamplesWithCode(): number {
    return this.samples().filter(s => !!s).length;
  }

  allDoreWeightsAssigned(): boolean {
    if(!this.finishingMode()) return false;
    const ids = this.sampleIds();
    const dw = this.doreWeights();
    for(let i=0;i<ids.length;i++){
    if(ids[i]) {
        const w = dw[i];
        if(w===null || w===undefined || w<=0) return false;
      }
    }
    return true;
  }

  private buildFinishCupellationPayload(): { sampleId: string; doreWeight: number }[] | null {
    const out: { sampleId: string; doreWeight: number }[] = [];
    const ids = this.sampleIds();
    const dw = this.doreWeights();
    for(let i=0;i<ids.length;i++){
      const id = ids[i];
  if(!id) continue;
      const w = dw[i];
  if(w===null || w===undefined || w<=0) return null;
      out.push({ sampleId: id, doreWeight: w });
    }
    return out.length? out : null;
  }
  clearAll(){
    this.fullReset();
  }
  
}
