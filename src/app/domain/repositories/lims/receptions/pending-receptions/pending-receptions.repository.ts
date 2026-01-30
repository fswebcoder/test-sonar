import { ICompletePendingReceptionParamsEntity } from "@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity";
import { IListPendingReceptionsResponseEntity } from "@/domain/entities/lims/receptions/pending-receptions/list-pending-receptions-response.entity";
import { IPendingReceptionEntity } from "@/domain/entities/lims/receptions/pending-receptions/pending-reception.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class PendingReceptionsRepository implements IGetAll<IPendingReceptionEntity ,false>{
    abstract getAll(): Observable<IListPendingReceptionsResponseEntity>;
    abstract completePendingReception(params: ICompletePendingReceptionParamsEntity): Observable<IEmptyResponse>;
}