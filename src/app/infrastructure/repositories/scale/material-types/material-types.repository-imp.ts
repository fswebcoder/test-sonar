import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { TPaginationParams } from "@SV-Development/utilities";
import { ICreateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/create-material-type-params.entity";
import { IListMaterialTypesResponseEntity } from "@/domain/entities/scale/material-types/list-material-types-response.entity";
import { IUpdateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/update-material-type-params.entity";
import { MaterialTypesRepository } from "@/domain/repositories/scale/material-types/material-types.repository";
import { MaterialTypesDatasourceService } from "@/infrastructure/datasources/scale/material-types/material-types-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

@Injectable({
  providedIn: "root"
})
export class MaterialTypesRepositoryImp extends MaterialTypesRepository {
  private readonly materialTypesDatasource = inject(MaterialTypesDatasourceService);

  getAll(params: TPaginationParams): Observable<IListMaterialTypesResponseEntity> {
    return this.materialTypesDatasource.getAll(params);
  }

  create(data: ICreateMaterialTypeParamsEntity): Observable<IEmptyResponse> {
    return this.materialTypesDatasource.create(data);
  }

  update(params: IUpdateMaterialTypeParamsEntity): Observable<IEmptyResponse> {
    return this.materialTypesDatasource.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.materialTypesDatasource.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.materialTypesDatasource.activate(id);
  }
}
