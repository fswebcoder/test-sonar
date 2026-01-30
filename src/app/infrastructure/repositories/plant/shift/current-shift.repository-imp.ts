import { IAddPersonnelParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import ICurrentShiftResponseEntity from "@/domain/entities/plant/shift/current-shift-response.entity";
import { IDeleteShiftPersonnelParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import CurrentShiftRepository from "@/domain/repositories/plant/shift/current-shift.repository";
import CurrentShiftDataSourceService from "@/infrastructure/datasources/plant/shift/current-shift-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root"
})
export default class CurrentShiftRepositoryImp implements CurrentShiftRepository {

  currentShiftDatasourceService: CurrentShiftDataSourceService = inject(CurrentShiftDataSourceService);

  create(): Observable<ICurrentShiftResponseEntity> {
    return this.currentShiftDatasourceService.create();
  }

  getCurrentShift(): Observable<ICurrentShiftResponseEntity> {
    return this.currentShiftDatasourceService.getCurrentShift();
  }

  addPersonnel(params: IAddPersonnelParamsEntity): Observable<IEmptyResponse> {
    return this.currentShiftDatasourceService.addPersonnel(params);
  }

  closeShift(): Observable<IEmptyResponse> {
    return this.currentShiftDatasourceService.closeShift();
  }

  deletePersonnel(params: IDeleteShiftPersonnelParamsEntity): Observable<IEmptyResponse> {
    return this.currentShiftDatasourceService.deletePersonnel(params);
  }

}