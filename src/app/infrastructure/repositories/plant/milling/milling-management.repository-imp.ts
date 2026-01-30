import IAddBatchParamsEntity from "@/domain/entities/plant/milling/add-batch-params.entity";
import IEditVariableParamsEntity from "@/domain/entities/plant/milling/edit-variable-params.entity";
import { IGetMillingDetailParamsEntity } from "@/domain/entities/plant/milling/get-milling-detail-params.entity";
import { IGetMillingDetailResponseEntity } from "@/domain/entities/plant/milling/get-milling-detail-response.entity";
import IGetMillsResponseEntity from "@/domain/entities/plant/milling/get-mills-response.entity";
import { IListMillingDetailShiftResponseEntity } from "@/domain/entities/plant/milling/milling-detail-shift-response.entity";
import { IStartMillingParamsEntity } from "@/domain/entities/plant/milling/start-milling-params.entity";
import IStopMillingParamsEntity from "@/domain/entities/plant/milling/stop-milling-params.entity";
import MillingManagementRepository from "@/domain/repositories/plant/milling/milling-management.repository";
import MillingManagementDatasourceService from "@/infrastructure/datasources/plant/milling/milling-management-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default class MillingManagementRepositoryImp implements MillingManagementRepository {
  millingManagementDatasourceService:MillingManagementDatasourceService = inject(MillingManagementDatasourceService);

  getAll(): Observable<IGetMillsResponseEntity> {
    return this.millingManagementDatasourceService.getAll();
  }

  addBatch(params: IAddBatchParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementDatasourceService.addBatch(params)
  } 

  editVariable(params: IEditVariableParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementDatasourceService.editVariable(params);
  }

  startMill(params: IStartMillingParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementDatasourceService.startMill(params);
  }

  stopMill(params: IStopMillingParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementDatasourceService.stopMill(params);
  }

  finishMill(shiftInfoId: string): Observable<IEmptyResponse> {
    return this.millingManagementDatasourceService.finishMill(shiftInfoId);
  }

  getMillingDetail(params: IGetMillingDetailParamsEntity): Observable<IGetMillingDetailResponseEntity> {
    return this.millingManagementDatasourceService.getMillingDetail(params);
  }

  getMillingDetailShifts(date:string): Observable<IListMillingDetailShiftResponseEntity> {
    return this.millingManagementDatasourceService.getMillingDetailShifts(date);
  }

  getCurrentMillingDetailShift(): Observable<IGetMillingDetailResponseEntity> {
    return this.millingManagementDatasourceService.getCurrentMillingDetailShift();
  }

}