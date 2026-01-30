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
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OvenUseCase implements OvenRepository{
    private readonly ovenRepository = inject(OvenRepository);
    getAll(): Observable<IOvenResponseEntity> {
        return this.ovenRepository.getAll();
    }

    getEf(params: IOvenGetEFParamsEntity): Observable<IOvenGetEFResponseEntity> {
        return this.ovenRepository.getEf(params);
    }

    createEf(params: IOvenCreateEFParamsEntity): Observable<IOvenCreateEFResponseEntity> {
        return this.ovenRepository.createEf(params);
    }

    updateEf(params: IOvenUpdateEFParamsEntity): Observable<IOvenUpdateEFResponseEntity> {
        return this.ovenRepository.updateEf(params);
    }

    completeFoundry(params: IOvenEFCompleteFoundryParamsEntity): Observable<IEmptyResponse> {
        return this.ovenRepository.completeFoundry(params);
    }

    completeCopelacion(params: IOvenEFCompleteCopelacionParamsEntity): Observable<IEmptyResponse> {
        return this.ovenRepository.completeCopelacion(params);
    }
}