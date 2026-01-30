import { IAddPersonnelShiftConfigParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import { IDeleteShiftPersonnelConfigParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import IGetShiftConfigResponseEntity from "@/domain/entities/plant/shift/get-shift-config-response.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default abstract class ShiftConfigRepository {
  abstract getShiftConfig(shiftConfigId: string): Observable<IGetShiftConfigResponseEntity>;
  abstract addPersonnel(params: IAddPersonnelShiftConfigParamsEntity): Observable<IEmptyResponse>;
  abstract deletePersonnel(params: IDeleteShiftPersonnelConfigParamsEntity): Observable<IEmptyResponse>;
}
  