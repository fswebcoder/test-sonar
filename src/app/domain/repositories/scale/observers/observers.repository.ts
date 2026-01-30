import { ICreateObserverParamsEntity } from "@/domain/entities/scale/observers/create-observer-params.entity";
import { IObserverEntity } from "@/domain/entities/scale/observers/observer.entity";
import { IListObserversResponseEntity } from "@/domain/entities/scale/observers/list-observers-response.entity";
import { IUpdateObserverParamsEntity } from "@/domain/entities/scale/observers/update-observer-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export abstract class ObserversRepository implements ICreateData<ICreateObserverParamsEntity, null>, IGetAll<IObserverEntity, true> {
    abstract create(data: ICreateObserverParamsEntity): Observable<IEmptyResponse>;
    abstract createObserverForSupplier(data: ICreateObserverParamsEntity): Observable<IEmptyResponse>;
    abstract getAll(params: TPaginationParams): Observable<IListObserversResponseEntity>;
    abstract update(params: IUpdateObserverParamsEntity): Observable<IEmptyResponse>;
    abstract desactivate(id: string): Observable<IEmptyResponse>;
    abstract activate(id: string): Observable<IEmptyResponse>;
    abstract getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IObserverEntity | null>>;
}
