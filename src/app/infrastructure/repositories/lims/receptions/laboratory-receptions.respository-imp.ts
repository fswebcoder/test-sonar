import IGetSampleLaboratoryReceptionsResponse from "@/domain/entities/lims/receptions/laboratory/get-sample-laboratory-receptions-response.entity";
import { ILaboratoryReceptionParams } from "@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity";
import { ILaboratoryReceptionApiResponseEntity } from "@/domain/entities/lims/receptions/laboratory/laboratory-receptions-response.entity";
import { LaboratoryReceptionRepository } from "@/domain/repositories/lims/receptions/laboratory/laboratory-receptions-repository";
import { LaboratoryReceptionsDatasourceService } from "@/infrastructure/datasources/lims/receptions/laboratory-receptions-datasource.service";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LaboratoryReceptionsRepositoryImp extends LaboratoryReceptionRepository {
    laboratoryReceptionsDatasourceService: LaboratoryReceptionsDatasourceService = inject(LaboratoryReceptionsDatasourceService);

    analyze(data: ILaboratoryReceptionParams): Observable<ILaboratoryReceptionApiResponseEntity> {
        return this.laboratoryReceptionsDatasourceService.analyze(data);
    }

    getSample(sampleCode: string): Observable<IGetSampleLaboratoryReceptionsResponse> {
        return this.laboratoryReceptionsDatasourceService.getSample(sampleCode);
    }
}