import { ICreateSampleTypeParams } from "@/domain/entities/lims/sample-types/create-sample-type-params.entity";
import { IEditSampleTypeParams } from "@/domain/entities/lims/sample-types/edit-sample-type-params.entity";
import { IListSampleTypesParamsEntity } from "@/domain/entities/lims/sample-types/list-sample-types-params.entity";
import { IListSampleTypesResponseEntity } from "@/domain/entities/lims/sample-types/list-sample-types-response.entity";
import { ISampleTypeEntity } from "@/domain/entities/lims/sample-types/sample-type.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class SampleTypeRepository implements IGetAll<ISampleTypeEntity, true>, ICreateData<ICreateSampleTypeParams, null>{
    abstract getAll(params: IListSampleTypesParamsEntity): Observable<IListSampleTypesResponseEntity>;
    abstract create(data: ICreateSampleTypeParams): Observable<IEmptyResponse>;
    abstract edit(data: IEditSampleTypeParams): Observable<IEmptyResponse>;
    abstract inactivate(id: string): Observable<IEmptyResponse>;
    abstract activate(id: string): Observable<IEmptyResponse>;
}