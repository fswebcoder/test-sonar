import { IXrfParamsEntity } from "@/domain/entities/lims/analysis/xrf/xrf-params.entity";
import { IErrorsXrfResponseEntity, IXrfResponseEntity } from "@/domain/entities/lims/analysis/xrf/xrf-response";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class XrfRepository implements ICreateData<IXrfParamsEntity, IErrorsXrfResponseEntity> {
    abstract create(params: IXrfParamsEntity): Observable<IXrfResponseEntity>;
}