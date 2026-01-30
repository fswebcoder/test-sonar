import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ILaboratoryReceptionParams } from "@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity";
import { ILaboratoryReceptionApiResponseEntity } from "@/domain/entities/lims/receptions/laboratory/laboratory-receptions-response.entity";
import IGetSampleLaboratoryReceptionsResponse from "@/domain/entities/lims/receptions/laboratory/get-sample-laboratory-receptions-response.entity";

@Injectable({
  providedIn: 'root'
})
export abstract class LaboratoryReceptionRepository {
 abstract analyze(data: ILaboratoryReceptionParams): Observable<ILaboratoryReceptionApiResponseEntity> 
 abstract getSample(sampleCode: string): Observable<IGetSampleLaboratoryReceptionsResponse>
}