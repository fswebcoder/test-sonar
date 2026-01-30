import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { MaterialTypesRepository } from "@/domain/repositories/scale/material-types/material-types.repository";
import { TPaginationParams } from "@SV-Development/utilities";
import { IListMaterialTypesResponseEntity } from "@/domain/entities/scale/material-types/list-material-types-response.entity";
import { ICreateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/create-material-type-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IUpdateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/update-material-type-params.entity";

@Injectable({
  providedIn: "root"
})
export class MaterialTypesUsecase implements MaterialTypesRepository {
  private readonly materialTypesRepository = inject(MaterialTypesRepository);

  getAll(params: TPaginationParams): Observable<IListMaterialTypesResponseEntity> {
    return this.materialTypesRepository.getAll(params);
  }

  create(data: ICreateMaterialTypeParamsEntity): Observable<IEmptyResponse> {
    return this.materialTypesRepository.create(data);
  }

  update(params: IUpdateMaterialTypeParamsEntity): Observable<IEmptyResponse> {
    return this.materialTypesRepository.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.materialTypesRepository.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.materialTypesRepository.activate(id);
  }
}
