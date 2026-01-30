import { IReadScaleResponseEntity } from "@/domain/entities/lims/sample-scale/read-scale-response.entity";
import { ISampleScaleParamsEntity } from "@/domain/entities/lims/sample-scale/sample-scale-params.entity";
import { Observable } from "rxjs";

export abstract class SampleScaleRepository {
    abstract readWeight(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<false>>
    abstract readTare(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<true>>
}