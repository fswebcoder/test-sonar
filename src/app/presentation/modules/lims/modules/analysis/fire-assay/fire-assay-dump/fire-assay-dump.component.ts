import IFurnaceEntity from '@/domain/entities/lims/furnaces/furnace.entity';
import { Component, input, output } from '@angular/core';
import { IStartSmeltingParams } from '@/domain/entities/lims/analysis/fire-assay/start-smelting-params.entity';
import { IFinishSmeltingParams } from '@/domain/entities/lims/analysis/fire-assay/finish-smelting-params.entity';
import { CupellationSectionComponent } from "../components/cupellation/cupellation-section/cupellation-section.component";
import { SmeltingSectionComponent } from "../components/smelting/smelting-section/smelting-section.component";
import { ISmeltingActivityData } from '@/domain/entities/lims/analysis/fire-assay/smelting-activity-response.entity';
import { IStartCupellationParams } from '@/domain/entities/lims/analysis/fire-assay/start-cupellation-params.entity';
import { IFinishCupellationParams } from '@/domain/entities/lims/analysis/fire-assay/finish-cupellation-params.entity';

@Component({
  selector: 'svi-fire-assay-dump',
  imports: [CupellationSectionComponent, SmeltingSectionComponent],
  templateUrl: './fire-assay-dump.component.html',
  styleUrl: './fire-assay-dump.component.scss'
})
export class FireAssayDumpComponent {

  cupellationFurnaces = input.required<IFurnaceEntity[]>()
  smeltingFurnaces = input.required<IFurnaceEntity[]>()
  furnaceActivity = input<any | null>(null)
  finishedSmeltings = input.required<ISmeltingActivityData[]>()
  activeCupellation = input<ISmeltingActivityData | null>(null)
  cupellationClearKey = input<number>(0)
  smeltingClearKey = input<number>(0)

  onSmeltingFurnaceChange = output<string>()
  onStartSmelting = output<IStartSmeltingParams>()
  onFinishSmelting = output<IFinishSmeltingParams>()
  onCupellationFurnaceChange = output<string>()
  onStartCupellation = output<IStartCupellationParams>()
  onFinishCupellation = output<IFinishCupellationParams>()


  smeltingFurnaceChange(furnaceId:string){
    this.onSmeltingFurnaceChange.emit(furnaceId);
  }

  cupellationFurnaceChange(furnaceId:string){
    this.onCupellationFurnaceChange.emit(furnaceId);
  }

  startSmelting(params: IStartSmeltingParams){
    this.onStartSmelting.emit(params);
  }

  finishSmelting(params: IFinishSmeltingParams){
    this.onFinishSmelting.emit(params);
  }

  startCupellation(params: IStartCupellationParams){
    this.onStartCupellation.emit(params);
  }

  finishCupellation(params: IFinishCupellationParams){
    this.onFinishCupellation.emit(params);
  }

}
