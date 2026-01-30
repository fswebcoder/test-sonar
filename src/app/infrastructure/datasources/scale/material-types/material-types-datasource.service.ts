import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { TPaginationParams } from "@SV-Development/utilities";
import { IListMaterialTypesResponseEntity } from "@/domain/entities/scale/material-types/list-material-types-response.entity";
import { ICreateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/create-material-type-params.entity";
import { IUpdateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/update-material-type-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { MaterialTypesRepository } from "@/domain/repositories/scale/material-types/material-types.repository";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: "root"
})
export class MaterialTypesDatasourceService extends BaseHttpService<undefined> implements MaterialTypesRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}material-type/`;

  getAll(params: TPaginationParams): Observable<IListMaterialTypesResponseEntity> {
    return this.get<IListMaterialTypesResponseEntity>("", { params: buildHttpParams(params) });
  }

  create(data: ICreateMaterialTypeParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(data, "create");
  }

  update(params: IUpdateMaterialTypeParamsEntity): Observable<IEmptyResponse> {
    const { id, ...payload } = params;
    return this.patch<IEmptyResponse>(payload, `${id}`);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`${id}`);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>(undefined, `activate/${id}`);
  }
}
