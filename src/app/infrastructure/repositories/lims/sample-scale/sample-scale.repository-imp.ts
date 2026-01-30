import { IReadScaleResponseEntity } from "@/domain/entities/lims/sample-scale/read-scale-response.entity";
import { ISampleScaleParamsEntity } from "@/domain/entities/lims/sample-scale/sample-scale-params.entity";
import { SampleScaleRepository } from "@/domain/repositories/lims/sample-scale/sample-scale.repository";
import { SampleScaleDatasourceService } from "@/infrastructure/datasources/lims/sample-scale/sample-scale-datasource.service";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SampleScaleRepositoryImp implements SampleScaleRepository {
    private readonly datasource = inject(SampleScaleDatasourceService);

    readWeight(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<false>> {
        return this.datasource.readWeight(params);
    }
    readTare(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<true>>  {
        return this.datasource.readTare(params);
    }

}
