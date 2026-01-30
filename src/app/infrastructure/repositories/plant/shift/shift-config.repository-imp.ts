import {  IAddPersonnelShiftConfigParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import { IDeleteShiftPersonnelConfigParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import IGetShiftConfigResponseEntity from "@/domain/entities/plant/shift/get-shift-config-response.entity";
import ShiftConfigRepository from "@/domain/repositories/plant/shift/shift-config.repository";
import ShiftConfigDataSourceService from "@/infrastructure/datasources/plant/shift/shift-config-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export default class ShiftConfigRepositoryImpl implements ShiftConfigRepository {

  shiftConfigDatasource = inject(ShiftConfigDataSourceService);

  getShiftConfig(shiftConfigId: string): Observable<IGetShiftConfigResponseEntity> {
    return this.shiftConfigDatasource.getShiftConfig(shiftConfigId);
  }

  addPersonnel(params: IAddPersonnelShiftConfigParamsEntity): Observable<IEmptyResponse> {
    return this.shiftConfigDatasource.addPersonnel(params);
  }

  deletePersonnel(params: IDeleteShiftPersonnelConfigParamsEntity): Observable<IEmptyResponse> {
    return this.shiftConfigDatasource.deletePersonnel(params);
  }
}