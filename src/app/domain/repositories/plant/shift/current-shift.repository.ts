import { IAddPersonnelParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import ICurrentShiftResponseEntity from "@/domain/entities/plant/shift/current-shift-response.entity";
import { IDeleteShiftPersonnelParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import IShiftEntity from "@/domain/entities/plant/shift/shift.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export default abstract class CurrentShiftRepository implements ICreateData<undefined, IShiftEntity> {
  abstract create(): Observable<ICurrentShiftResponseEntity> 
  abstract getCurrentShift(): Observable<ICurrentShiftResponseEntity>
  abstract addPersonnel(params: IAddPersonnelParamsEntity): Observable<IEmptyResponse>
  abstract closeShift(): Observable<IEmptyResponse>
  abstract deletePersonnel(params: IDeleteShiftPersonnelParamsEntity): Observable<IEmptyResponse>
}
