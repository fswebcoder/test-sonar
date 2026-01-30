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
import { OvenDatasourceService } from "@/infrastructure/datasources/lims/analysis/oven-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OvenRepositoryImp extends OvenRepository{
    private readonly ovenDatasourceService = inject(OvenDatasourceService);
    getAll(): Observable<IOvenResponseEntity> {
        return this.ovenDatasourceService.getAll();
    }

    getEf(params: IOvenGetEFParamsEntity): Observable<IOvenGetEFResponseEntity> {
        return this.ovenDatasourceService.getEf(params);
    }

    createEf(params: IOvenCreateEFParamsEntity): Observable<IOvenCreateEFResponseEntity> {
        return this.ovenDatasourceService.createEf(params);
    }

    updateEf(params: IOvenUpdateEFParamsEntity): Observable<IOvenUpdateEFResponseEntity> {
        return this.ovenDatasourceService.updateEf(params);
    }

    completeFoundry(params: IOvenEFCompleteFoundryParamsEntity): Observable<IEmptyResponse> {
        return this.ovenDatasourceService.completeFoundry(params);
    }

    completeCopelacion(params: IOvenEFCompleteCopelacionParamsEntity): Observable<IEmptyResponse> {
        return this.ovenDatasourceService.completeCopelacion(params);
    }
}