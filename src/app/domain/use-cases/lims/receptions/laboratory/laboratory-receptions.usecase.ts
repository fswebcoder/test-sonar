import IGetSampleLaboratoryReceptionsResponse from "@/domain/entities/lims/receptions/laboratory/get-sample-laboratory-receptions-response.entity";
import { ILaboratoryReceptionParams } from "@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity";
import { ILaboratoryReceptionApiResponseEntity } from "@/domain/entities/lims/receptions/laboratory/laboratory-receptions-response.entity";
import { LaboratoryReceptionRepository } from "@/domain/repositories/lims/receptions/laboratory/laboratory-receptions-repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LaboratoryReceptionUseCase extends LaboratoryReceptionRepository {

  laboratoryRepository: LaboratoryReceptionRepository = inject(LaboratoryReceptionRepository);

  analyze(data: ILaboratoryReceptionParams): Observable<ILaboratoryReceptionApiResponseEntity> {
    return this.laboratoryRepository.analyze(data);
  }

  getSample(sampleCode: string): Observable<IGetSampleLaboratoryReceptionsResponse> {
    return this.laboratoryRepository.getSample(sampleCode);
  }
}