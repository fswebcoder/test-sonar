import { ICreateSampleTypeParams } from "@/domain/entities/lims/sample-types/create-sample-type-params.entity";
import { IEditSampleTypeParams } from "@/domain/entities/lims/sample-types/edit-sample-type-params.entity";
import { IListSampleTypesParamsEntity } from "@/domain/entities/lims/sample-types/list-sample-types-params.entity";
import { IListSampleTypesResponseEntity } from "@/domain/entities/lims/sample-types/list-sample-types-response.entity";
import { SampleTypeRepository } from "@/domain/repositories/lims/sample-types/sample-types.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SampleTypesUseCase implements SampleTypeRepository {
    private readonly sampleTypeRepository: SampleTypeRepository = inject(SampleTypeRepository);

    getAll(params: IListSampleTypesParamsEntity): Observable<IListSampleTypesResponseEntity> {
        return this.sampleTypeRepository.getAll(params);
    }

    create(data: ICreateSampleTypeParams): Observable<IEmptyResponse> {
        return this.sampleTypeRepository.create(data);
    }

    edit(data: IEditSampleTypeParams): Observable<IEmptyResponse> {
        return this.sampleTypeRepository.edit(data);
    }

    inactivate(id: string): Observable<IEmptyResponse> {
        return this.sampleTypeRepository.inactivate(id);
    }

    activate(id: string): Observable<IEmptyResponse> {
        return this.sampleTypeRepository.activate(id);
    }
}