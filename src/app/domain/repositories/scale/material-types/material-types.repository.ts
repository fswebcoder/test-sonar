import { ICreateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/create-material-type-params.entity";
import { IListMaterialTypesResponseEntity } from "@/domain/entities/scale/material-types/list-material-types-response.entity";
import { IMaterialTypeEntity } from "@/domain/entities/scale/material-types/material-type.entity";
import { IUpdateMaterialTypeParamsEntity } from "@/domain/entities/scale/material-types/update-material-type-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export abstract class MaterialTypesRepository implements ICreateData<ICreateMaterialTypeParamsEntity, null>, IGetAll<IMaterialTypeEntity, true>{
    abstract getAll(params: TPaginationParams): Observable<IListMaterialTypesResponseEntity>;
    abstract create(data: ICreateMaterialTypeParamsEntity): Observable<IEmptyResponse>;
    abstract update(params: IUpdateMaterialTypeParamsEntity): Observable<IEmptyResponse>;
    abstract desactivate(id: string): Observable<IEmptyResponse>;
    abstract activate(id: string): Observable<IEmptyResponse>;
}