import { IAddPersonnelShiftConfigParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import { IDeleteShiftPersonnelConfigParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import IGetShiftConfigResponseEntity from "@/domain/entities/plant/shift/get-shift-config-response.entity";
import ShiftConfigRepository from "@/domain/repositories/plant/shift/shift-config.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export default class ShiftConfigUseCase implements ShiftConfigRepository{
  shiftConfigRepository = inject<ShiftConfigRepository>(ShiftConfigRepository);

  getShiftConfig(shiftConfigId: string): Observable<IGetShiftConfigResponseEntity> {
    return this.shiftConfigRepository.getShiftConfig(shiftConfigId);
  }

  addPersonnel(params: IAddPersonnelShiftConfigParamsEntity): Observable<IEmptyResponse> {
    return this.shiftConfigRepository.addPersonnel(params);
  }

  deletePersonnel(params: IDeleteShiftPersonnelConfigParamsEntity): Observable<IEmptyResponse> {
    return this.shiftConfigRepository.deletePersonnel(params);
  }
}