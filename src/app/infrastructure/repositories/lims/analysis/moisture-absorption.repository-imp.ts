import { ICreateMoistureDeterminationParamsEntity } from "@/domain/entities/lims/analysis/moisture-determination/create-moisture-determination-params.entity";
import { ISampleMoistureDeterminationParamsEntity } from "@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-params.entity";
import { ISampleMoistureDeterminationResponseEntity } from "@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-response.entity";
import { IUpdateMoistureDeterminationParamsEntity } from "@/domain/entities/lims/analysis/moisture-determination/update-moisture-determination-params.entity";
import { MoistureDeterminationRepository } from "@/domain/repositories/lims/analysis/moisture-determination.repository";
import { MoistureDeterminationService } from "@/infrastructure/datasources/lims/analysis/moisture-determination-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MoistureDeterminationRepositoryImp implements MoistureDeterminationRepository {
    private readonly moistureDeterminationService = inject(MoistureDeterminationService);

    create(params: ICreateMoistureDeterminationParamsEntity): Observable<IEmptyResponse> {
        return this.moistureDeterminationService.create(params);
    }

    getSample(params: ISampleMoistureDeterminationParamsEntity): Observable<ISampleMoistureDeterminationResponseEntity> {
        return this.moistureDeterminationService.getSample(params);
    }

    update(params: IUpdateMoistureDeterminationParamsEntity): Observable<IEmptyResponse> {
        return this.moistureDeterminationService.update(params);
    }
}