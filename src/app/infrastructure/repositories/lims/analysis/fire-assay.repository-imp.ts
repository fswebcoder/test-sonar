import { IFinishCupellationParams } from "@/domain/entities/lims/analysis/fire-assay/finish-cupellation-params.entity";
import { IFinishSmeltingParams } from "@/domain/entities/lims/analysis/fire-assay/finish-smelting-params.entity";
import ISmeltingActivityParams from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-params.entity";
import ISmeltingActivityResponse, { ISmeltingActivityData } from "@/domain/entities/lims/analysis/fire-assay/smelting-activity-response.entity";
import { IStartCupellationParams } from "@/domain/entities/lims/analysis/fire-assay/start-cupellation-params.entity";
import { IStartSmeltingParams } from "@/domain/entities/lims/analysis/fire-assay/start-smelting-params.entity";
import FireAssayRepository from "@/domain/repositories/lims/analysis/fire-assay.repository";
import FireAssayDataSourceService from "@/infrastructure/datasources/lims/analysis/fire-assay-datasource.service";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default class FireAssayRepositoryImp implements FireAssayRepository {
  fireAssayDataSource = inject(FireAssayDataSourceService);

  getFurnaceActivity(params: ISmeltingActivityParams): Observable<ISmeltingActivityResponse> {
    return this.fireAssayDataSource.getFurnaceActivity(params);
  }

  startSmelting(params: IStartSmeltingParams): Observable<IEmptyResponse> {
    return this.fireAssayDataSource.startSmelting(params);
  }

  finishSmelting(params: IFinishSmeltingParams): Observable<IEmptyResponse> {
    return this.fireAssayDataSource.finishSmelting(params);
  }

  getFinishedSmelting(): Observable<IFlexibleApiResponse<ISmeltingActivityData[], "list">> {
    return this.fireAssayDataSource.getFinishedSmelting();
  }

  startCupellation(params: IStartCupellationParams): Observable<IEmptyResponse> {
    return this.fireAssayDataSource.startCupellation(params);
  }

  getActiveCupellation(furnaceId: string): Observable<ISmeltingActivityResponse> {
    return this.fireAssayDataSource.getActiveCupellation(furnaceId);
  }

  finishCupellation(params: IFinishCupellationParams): Observable<IEmptyResponse> {
    return this.fireAssayDataSource.finishCupellation(params);
  }

}
