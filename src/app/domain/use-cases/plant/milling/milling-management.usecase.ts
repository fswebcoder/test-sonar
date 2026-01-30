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

@Injectable({
  providedIn: "root"
})
export default class MillingManagementUseCase implements MillingManagementRepository {
  millingManagementRepository: MillingManagementRepository = inject(MillingManagementRepository);

  getAll(): Observable<IGetMillsResponseEntity> {
    return this.millingManagementRepository.getAll();
  }

  addBatch(params: IAddBatchParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementRepository.addBatch(params)
  }

  editVariable(params: IEditVariableParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementRepository.editVariable(params);
  }

  startMill(params: IStartMillingParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementRepository.startMill(params);
  }

  stopMill(params: IStopMillingParamsEntity): Observable<IEmptyResponse> {
    return this.millingManagementRepository.stopMill(params);
  }

  finishMill(shiftInfoId: string): Observable<IEmptyResponse> {
    return this.millingManagementRepository.finishMill(shiftInfoId);
  }

  getMillingDetail(params: IGetMillingDetailParamsEntity): Observable<IGetMillingDetailResponseEntity> {
    return this.millingManagementRepository.getMillingDetail(params);
  }

  getMillingDetailShifts(date:string): Observable<IListMillingDetailShiftResponseEntity> {
    return this.millingManagementRepository.getMillingDetailShifts(date);
  }

  getCurrentMillingDetailShift(): Observable<IGetMillingDetailResponseEntity> {
    return this.millingManagementRepository.getCurrentMillingDetailShift();
  }
}