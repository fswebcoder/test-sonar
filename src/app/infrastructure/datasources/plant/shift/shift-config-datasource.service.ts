import { BaseHttpService } from "@/core/providers/base-http.service";
import { IAddPersonnelShiftConfigParamsEntity } from "@/domain/entities/plant/shift/add-personel-params.entity";
import { IDeleteShiftPersonnelConfigParamsEntity } from "@/domain/entities/plant/shift/delete-shift-personnel-params.entity";
import IGetShiftConfigResponseEntity from "@/domain/entities/plant/shift/get-shift-config-response.entity";
import ShiftConfigRepository from "@/domain/repositories/plant/shift/shift-config.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: 'root'
})
export default class ShiftConfigDataSourceService extends BaseHttpService<unknown> implements ShiftConfigRepository {

  
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}configure-personnel/`;

  getShiftConfig(shiftConfigId: string): Observable<IGetShiftConfigResponseEntity> {
    return this.http.get<IGetShiftConfigResponseEntity>(`${this.baseUrl}get-configure-personnel-shift/${shiftConfigId}`);
  }

  addPersonnel(params: IAddPersonnelShiftConfigParamsEntity): Observable<IEmptyResponse> {
    const { shiftConfigId, ...body } = params;
    return this.http.post<IEmptyResponse>(`${this.baseUrl}add-configure-personnel-shift/${shiftConfigId}`, body);
  }

  deletePersonnel(params: IDeleteShiftPersonnelConfigParamsEntity): Observable<IEmptyResponse> {
    const { id } = params;
    // Following current-shift pattern, using DELETE with body when needed; here only id is required in URL
    return this.http.delete<IEmptyResponse>(`${this.baseUrl}delete-configure-personnel-shift/${id}`);
  }
}