import { ILeachwellResponseEntity } from "@/domain/entities/lims/analysis/leachwell/leachwell-response-entity";
import { ILeachwellCompleteParamsEntity, ILeachwellParamsEntity } from "@/domain/entities/lims/analysis/leachwell/leachwell-params.entity";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IGeneralResponse, PaginatedData, TPaginationParams } from "@SV-Development/utilities";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

@Injectable({
    providedIn: 'root'
})
export abstract class LeachwellRepository implements ICreateData<ILeachwellParamsEntity, ILeachwellResponseEntity>, IGetAll<ILeachwellResponseEntity, true> {
    abstract create(params: ILeachwellParamsEntity): Observable<IGeneralResponse<ILeachwellResponseEntity>>;
    abstract getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ILeachwellResponseEntity>>>;
    abstract complete(params: ILeachwellCompleteParamsEntity): Observable<IEmptyResponse>;
}