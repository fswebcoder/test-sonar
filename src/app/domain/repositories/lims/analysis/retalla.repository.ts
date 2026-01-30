import { IRetallaParamsEntity } from "@/domain/entities/lims/analysis/retalla/retalla-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class RetallaRepository implements ICreateData<IRetallaParamsEntity, null> {
    abstract create(params: IRetallaParamsEntity): Observable<IEmptyResponse>;
}