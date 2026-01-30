import { IAddPersonnelParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import ICurrentShiftResponseEntity from "@/domain/entities/plant/shift/current-shift-response.entity";
import { IDeleteShiftPersonnelParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import CurrentShiftRepository from "@/domain/repositories/plant/shift/current-shift.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export default class CurrentShiftUseCase implements CurrentShiftRepository{
  currentShiftRepository: CurrentShiftRepository = inject(CurrentShiftRepository);

  create(): Observable<ICurrentShiftResponseEntity> {
    return this.currentShiftRepository.create();
  }

  getCurrentShift(): Observable<ICurrentShiftResponseEntity> {
    return this.currentShiftRepository.getCurrentShift();
  }

  addPersonnel(params: IAddPersonnelParamsEntity): Observable<IEmptyResponse> {
    return this.currentShiftRepository.addPersonnel(params);
  }

  closeShift(): Observable<IEmptyResponse> {
    return this.currentShiftRepository.closeShift();
  }

  deletePersonnel(params: IDeleteShiftPersonnelParamsEntity): Observable<IEmptyResponse> {
    return this.currentShiftRepository.deletePersonnel(params);
  }
}
