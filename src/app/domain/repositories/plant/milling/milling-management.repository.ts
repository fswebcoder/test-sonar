import IAddBatchParamsEntity from "@/domain/entities/plant/milling/add-batch-params.entity";
import IEditVariableParamsEntity from "@/domain/entities/plant/milling/edit-variable-params.entity";
import { IGetMillingDetailParamsEntity } from "@/domain/entities/plant/milling/get-milling-detail-params.entity";
import { IGetMillingDetailResponseEntity } from "@/domain/entities/plant/milling/get-milling-detail-response.entity";
import IGetMillsResponseEntity from "@/domain/entities/plant/milling/get-mills-response.entity";
import IMill from "@/domain/entities/plant/milling/mill.entity";
import { IListMillingDetailShiftResponseEntity } from "@/domain/entities/plant/milling/milling-detail-shift-response.entity";
import { IStartMillingParamsEntity } from "@/domain/entities/plant/milling/start-milling-params.entity";
import IStopMillingParamsEntity from "@/domain/entities/plant/milling/stop-milling-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export default abstract class MillingManagementRepository implements IGetAll<IMill, false>{
  abstract getAll(): Observable<IGetMillsResponseEntity> 
  abstract addBatch(params: IAddBatchParamsEntity): Observable<IEmptyResponse>
  abstract editVariable(params: IEditVariableParamsEntity): Observable<IEmptyResponse>
  abstract startMill(params: IStartMillingParamsEntity): Observable<IEmptyResponse>
  abstract stopMill(params: IStopMillingParamsEntity): Observable<IEmptyResponse>
  abstract finishMill(shiftInfoId: string): Observable<IEmptyResponse>
  abstract getMillingDetail(params: IGetMillingDetailParamsEntity): Observable<IGetMillingDetailResponseEntity>
  abstract getMillingDetailShifts(date:string): Observable<IListMillingDetailShiftResponseEntity>
  abstract getCurrentMillingDetailShift(): Observable<IGetMillingDetailResponseEntity>
}
