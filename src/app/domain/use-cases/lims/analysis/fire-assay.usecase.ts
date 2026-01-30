import { IFinishCupellationParams } from "@/domain/entities/lims/analysis/fire-assay/finish-cupellation-params.entity";
import { IFinishSmeltingParams } from "@/domain/entities/lims/analysis/fire-assay/finish-smelting-params.entity";
import ISmeltingActivityParams from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-params.entity";
import ISmeltingActivityResponse, { ISmeltingActivityData } from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-response.entity";
import { IStartCupellationParams } from "@/domain/entities/lims/analysis/fire-assay/start-cupellation-params.entity";
import { IStartSmeltingParams } from "@/domain/entities/lims/analysis/fire-assay/start-smelting-params.entity";
import FireAssayRepository from "@/domain/repositories/lims/analysis/fire-assay.repository";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default class FireAssayUseCase implements FireAssayRepository{
  private readonly fireAssayRepository = inject(FireAssayRepository)

  getFurnaceActivity(params: ISmeltingActivityParams): Observable<ISmeltingActivityResponse> {
    return this.fireAssayRepository.getFurnaceActivity(params);
  }

  startSmelting(params: IStartSmeltingParams): Observable<IEmptyResponse> {
    return this.fireAssayRepository.startSmelting(params);
  }

  finishSmelting(params: IFinishSmeltingParams): Observable<IEmptyResponse> {
    return this.fireAssayRepository.finishSmelting(params);
  }

  getFinishedSmelting(): Observable<IFlexibleApiResponse<ISmeltingActivityData[], "list">> {
    return this.fireAssayRepository.getFinishedSmelting();
  }

  startCupellation(params: IStartCupellationParams): Observable<IEmptyResponse> {
    return this.fireAssayRepository.startCupellation(params);
  }

  getActiveCupellation(smeltingFurnaceId: string): Observable<ISmeltingActivityResponse> {
    return this.fireAssayRepository.getActiveCupellation(smeltingFurnaceId);
  }

  finishCupellation(params: IFinishCupellationParams): Observable<IEmptyResponse> {
    return this.fireAssayRepository.finishCupellation(params);
  }
}