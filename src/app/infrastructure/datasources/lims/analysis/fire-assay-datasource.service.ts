import { BaseHttpService } from "@/core/providers/base-http.service";
import { ISetCompanyResponseEntity } from "@/domain/entities/auth/set-company-response.entity";
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
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: 'root'
})
export default class FireAssayDataSourceService extends BaseHttpService<ISetCompanyResponseEntity> implements FireAssayRepository{
  private env = inject(ENVIRONMENT)
  protected baseUrl = `${this.env.services.security}analysis/fa/`;

  getFurnaceActivity(params: ISmeltingActivityParams): Observable<ISmeltingActivityResponse> {
    return this.http.get<ISmeltingActivityResponse>(`${this.baseUrl}get-active-smelting/${params.smeltingFurnaceId}`);
  }

  startSmelting(params: IStartSmeltingParams): Observable<IEmptyResponse> {
    return this.http.post<IEmptyResponse>(`${this.baseUrl}start-smelting`, params);
  }

  finishSmelting(params: IFinishSmeltingParams): Observable<IEmptyResponse> {
    const {fireAssayId, ...data} = params
    return this.http.patch<IEmptyResponse>(`${this.baseUrl}finish-smelting/${fireAssayId}`, data);
  }

  getFinishedSmelting(): Observable<IFlexibleApiResponse<ISmeltingActivityData[], "list">> {
    return this.http.get<IFlexibleApiResponse<ISmeltingActivityData[], "list">>(`${this.baseUrl}get-finished-smelting`);
  }

  startCupellation(params: IStartCupellationParams): Observable<IEmptyResponse> {
    return this.http.post<IEmptyResponse>(`${this.baseUrl}start-cupellation`, params);
  }

  getActiveCupellation(smeltingFurnaceId: string): Observable<ISmeltingActivityResponse> {
    return this.http.get<ISmeltingActivityResponse>(`${this.baseUrl}get-active-cupellation/${smeltingFurnaceId}`);
  }

  finishCupellation(params: IFinishCupellationParams): Observable<IEmptyResponse> {
    return this.http.patch<IEmptyResponse>(`${this.baseUrl}finish-cupellation/${params.fireAssayId}`, { samples: params.samples });
  }

}
