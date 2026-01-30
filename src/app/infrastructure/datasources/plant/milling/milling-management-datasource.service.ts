import { BaseHttpService } from "@/core/providers/base-http.service";
import IAddBatchParamsEntity from "@/domain/entities/plant/milling/add-batch-params.entity";
import IEditVariableParamsEntity from "@/domain/entities/plant/milling/edit-variable-params.entity";
import { IGetMillingDetailParamsEntity } from "@/domain/entities/plant/milling/get-milling-detail-params.entity";
import { IGetMillingDetailResponseEntity } from "@/domain/entities/plant/milling/get-milling-detail-response.entity";
import IGetMillsResponseEntity from "@/domain/entities/plant/milling/get-mills-response.entity";
import { IListMillingDetailShiftResponseEntity } from "@/domain/entities/plant/milling/milling-detail-shift-response.entity";
import { IStartMillingParamsEntity } from "@/domain/entities/plant/milling/start-milling-params.entity";
import IStopMillingParamsEntity from "@/domain/entities/plant/milling/stop-milling-params.entity";
import MillingManagementRepository from "@/domain/repositories/plant/milling/milling-management.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: 'root'
})
export default class MillingManagementDatasourceService extends BaseHttpService<unknown> implements MillingManagementRepository{
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}variable-reading/`;

  getAll(): Observable<IGetMillsResponseEntity> {
    return this.http.get<IGetMillsResponseEntity>(`${this.baseUrl}schema-process-mill`);
  }

  addBatch(params: IAddBatchParamsEntity): Observable<IEmptyResponse> {
    const { millId, ...body } = params;
    return this.http.post<IEmptyResponse>(`${this.baseUrl}add-milling/${millId}`, body)
  }

  editVariable(params: IEditVariableParamsEntity): Observable<IEmptyResponse> {
    const { shiftInfoId, ...body } = params;
    return this.http.post<IEmptyResponse>(`${this.baseUrl}register/${shiftInfoId}`, body);
  }

  startMill(params: IStartMillingParamsEntity): Observable<IEmptyResponse> {
    const { shiftInfoId, ...body } = params;
    return this.http.patch<IEmptyResponse>(`${this.baseUrl}start-milling/${shiftInfoId}`, body);
  }

  stopMill(params: IStopMillingParamsEntity): Observable<IEmptyResponse> {
    const {shiftInfoId, ...data} = params;
    return this.http.patch<IEmptyResponse>(`${this.baseUrl}stop-milling/${shiftInfoId}`, data);
  }

  finishMill(shiftInfoId: string): Observable<IEmptyResponse> {
    return this.http.patch<IEmptyResponse>(`${this.baseUrl}finish-milling/${shiftInfoId}`, {});
  }

  getMillingDetail(params: IGetMillingDetailParamsEntity): Observable<IGetMillingDetailResponseEntity> {
    return this.http.post<IGetMillingDetailResponseEntity>(`${this.baseUrl}show-milling-records`, params);
  }

  getMillingDetailShifts(date:string): Observable<IListMillingDetailShiftResponseEntity> {
    return this.http.post<IListMillingDetailShiftResponseEntity>(`${this.baseUrl}get-shifts-by-date`, {date});
  }

  getCurrentMillingDetailShift(): Observable<IGetMillingDetailResponseEntity> {
    return this.http.post<IGetMillingDetailResponseEntity>(`${this.baseUrl}current-show-milling-records`, {});
  }

}