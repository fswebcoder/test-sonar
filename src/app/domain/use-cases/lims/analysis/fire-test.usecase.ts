import { IFireTestParamsEntity } from "@/domain/entities/lims/analysis/fire-test/fire-test-params.entity";
import { FireTestRepository } from "@/domain/repositories/lims/analysis/fire-test.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FireTestUseCase implements FireTestRepository {
    private readonly fireTestRepository = inject(FireTestRepository);

    create(params: IFireTestParamsEntity): Observable<IEmptyResponse> {
        return this.fireTestRepository.create(params);
    }

    updateDoreWeight(sampleId: string, doreWeight: number): Observable<IEmptyResponse> {
        return this.fireTestRepository.updateDoreWeight(sampleId, doreWeight);
    }
}