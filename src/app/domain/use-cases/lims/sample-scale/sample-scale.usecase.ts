import { IReadScaleResponseEntity } from "@/domain/entities/lims/sample-scale/read-scale-response.entity";
import { ISampleScaleParamsEntity } from "@/domain/entities/lims/sample-scale/sample-scale-params.entity";
import { SampleScaleRepository } from "@/domain/repositories/lims/sample-scale/sample-scale.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SampleScaleUsecase implements SampleScaleRepository{
    private readonly repository = inject(SampleScaleRepository);
    readWeight(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<false>> {
        return this.repository.readWeight(params);
    }
    readTare(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<true>>  {
        return this.repository.readTare(params);
    }
}