import { IFinishCupellationParams } from "@/domain/entities/lims/analysis/fire-assay/finish-cupellation-params.entity";
import { IFinishSmeltingParams } from "@/domain/entities/lims/analysis/fire-assay/finish-smelting-params.entity";
import IFireAssayDetail from "@/domain/entities/lims/analysis/fire-assay/fire-assay-detail.entity";
import ISmeltingActivityParams from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-params.entity";
import ISmeltingActivityResponse, { ISmeltingActivityData } from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-response.entity";
import { IStartCupellationParams } from "@/domain/entities/lims/analysis/fire-assay/start-cupellation-params.entity";
import { IStartSmeltingParams } from "@/domain/entities/lims/analysis/fire-assay/start-smelting-params.entity";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default abstract class FireAssayRepository {
  abstract getFurnaceActivity(params: ISmeltingActivityParams): Observable<ISmeltingActivityResponse>;
  abstract startSmelting(params: IStartSmeltingParams): Observable<IEmptyResponse>;
  abstract finishSmelting(params: IFinishSmeltingParams): Observable<IEmptyResponse>;

  abstract getFinishedSmelting(): Observable<IFlexibleApiResponse<ISmeltingActivityData[], "list" >>

  abstract startCupellation(params: IStartCupellationParams): Observable<IEmptyResponse>;

  abstract getActiveCupellation(smeltingFurnaceId: string): Observable<ISmeltingActivityResponse>;

  abstract finishCupellation(params: IFinishCupellationParams): Observable<IEmptyResponse>;
}
