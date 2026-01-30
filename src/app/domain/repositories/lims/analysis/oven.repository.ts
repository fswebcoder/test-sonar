import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IOvenEntity } from "@/domain/entities/lims/analysis/fire-test/oven.entity";
import { IOvenResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-response.entity";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IOvenGetEFResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-get-ef-response.entity";
import { IOvenGetEFParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-get-ef-params.entity";
import { IOvenCreateEFParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-create-ef-params.entity";
import { IOvenCreateEFResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-create-ef-reponse.entity";
import { IOvenUpdateEFParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-update-ef-params.entity";
import { IOvenUpdateEFResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-update-ef-response.entity";
import { IOvenEFCompleteFoundryParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-ef-complete-foundry-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IOvenEFCompleteCopelacionParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-ef-complete-copelacion-params.entity";

@Injectable({
    providedIn: 'root'
})
export abstract class OvenRepository implements IGetAll<IOvenEntity, false>{
    abstract getAll(): Observable<IOvenResponseEntity>;

    abstract getEf(params: IOvenGetEFParamsEntity): Observable<IOvenGetEFResponseEntity>;

    abstract createEf(params: IOvenCreateEFParamsEntity): Observable<IOvenCreateEFResponseEntity>;

    abstract updateEf(params: IOvenUpdateEFParamsEntity): Observable<IOvenUpdateEFResponseEntity>;

    abstract completeFoundry(params: IOvenEFCompleteFoundryParamsEntity): Observable<IEmptyResponse>;

    abstract completeCopelacion(params: IOvenEFCompleteCopelacionParamsEntity): Observable<IEmptyResponse>;
}