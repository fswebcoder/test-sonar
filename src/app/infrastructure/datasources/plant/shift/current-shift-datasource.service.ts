import { BaseHttpService } from "@/core/providers/base-http.service";
import { IAddPersonnelParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import ICurrentShiftResponseEntity from "@/domain/entities/plant/shift/current-shift-response.entity";
import { IDeleteShiftPersonnelParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import CurrentShiftRepository from "@/domain/repositories/plant/shift/current-shift.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: "root"
})
export default class CurrentShiftDataSourceService extends BaseHttpService<ICurrentShiftResponseEntity> implements CurrentShiftRepository{

  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}shift/`;

  create(): Observable<ICurrentShiftResponseEntity> {
    return this.http.post<ICurrentShiftResponseEntity>(`${this.baseUrl}open`, {});
  }

 getCurrentShift(): Observable<ICurrentShiftResponseEntity> {
    return this.http.get<ICurrentShiftResponseEntity>(`${this.baseUrl}current`);
  }

  addPersonnel(params: IAddPersonnelParamsEntity): Observable<IEmptyResponse> {
    const {operationAreaId, ...data} = params;
    return this.http.post<IEmptyResponse>(`${this.baseUrl}select-info/${operationAreaId}`, data);
  }

  closeShift(): Observable<IEmptyResponse> {
    return this.http.patch<IEmptyResponse>(`${this.baseUrl}close`, {});
  }

  deletePersonnel(params: IDeleteShiftPersonnelParamsEntity): Observable<IEmptyResponse> {
    const {id, observation} = params;
    return this.http.delete<IEmptyResponse>(`${this.baseUrl}select-info/${id}`, { body: { observation } });
  }
  
}
