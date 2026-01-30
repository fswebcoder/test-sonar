import { BaseHttpService } from "@/core/providers/base-http.service";
import { IOvenCreateEFParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-create-ef-params.entity";
import { IOvenCreateEFResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-create-ef-reponse.entity";
import { IOvenEFCompleteFoundryParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-ef-complete-foundry-params.entity";
import { IOvenEFCompleteCopelacionParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-ef-complete-copelacion-params.entity";
import { IOvenGetEFParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-get-ef-params.entity";
import { IOvenGetEFResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-get-ef-response.entity";
import { IOvenResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-response.entity";
import { IOvenUpdateEFParamsEntity } from "@/domain/entities/lims/analysis/fire-test/oven-update-ef-params.entity";
import { IOvenUpdateEFResponseEntity } from "@/domain/entities/lims/analysis/fire-test/oven-update-ef-response.entity";
import { OvenRepository } from "@/domain/repositories/lims/analysis/oven.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class OvenDatasourceService extends BaseHttpService<IOvenResponseEntity> implements OvenRepository{
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}ovens/`;
    getAll(): Observable<IOvenResponseEntity> {
        return this.get<IOvenResponseEntity>("");
    }

    getEf(params: IOvenGetEFParamsEntity): Observable<IOvenGetEFResponseEntity> {
        return this.get<IOvenGetEFResponseEntity>(`trace-sample-oven`);
    }

    createEf(params: IOvenCreateEFParamsEntity): Observable<IOvenCreateEFResponseEntity> {
        return this.post<IOvenCreateEFResponseEntity>(params,"trace-sample-oven");
    }

    updateEf(params: IOvenUpdateEFParamsEntity): Observable<IOvenUpdateEFResponseEntity> {
        return this.patch<IOvenUpdateEFResponseEntity>(params,"trace-sample-oven");
    }

    completeFoundry(params: IOvenEFCompleteFoundryParamsEntity): Observable<IEmptyResponse> {
        return this.patch<IEmptyResponse>(params,"trace-sample-oven");
    }

    completeCopelacion(params: IOvenEFCompleteCopelacionParamsEntity): Observable<IEmptyResponse> {
        return this.patch<IEmptyResponse>(params,"trace-sample-oven");
    }
}