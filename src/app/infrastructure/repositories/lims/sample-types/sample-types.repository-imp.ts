import { ICreateSampleTypeParams } from "@/domain/entities/lims/sample-types/create-sample-type-params.entity";
import { IEditSampleTypeParams } from "@/domain/entities/lims/sample-types/edit-sample-type-params.entity";
import { IListSampleTypesParamsEntity } from "@/domain/entities/lims/sample-types/list-sample-types-params.entity";
import { IListSampleTypesResponseEntity } from "@/domain/entities/lims/sample-types/list-sample-types-response.entity";
import { SampleTypeRepository } from "@/domain/repositories/lims/sample-types/sample-types.repository";
import { SampleTypesDatasourceService } from "@/infrastructure/datasources/lims/sample-types/sample-types-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SampleTypeRepositoryImp implements SampleTypeRepository {
    private readonly sampleTypesDatasource: SampleTypeRepository = inject(SampleTypesDatasourceService);

    getAll(params: IListSampleTypesParamsEntity): Observable<IListSampleTypesResponseEntity> {
        return this.sampleTypesDatasource.getAll(params);
    }

    create(data: ICreateSampleTypeParams): Observable<IEmptyResponse> {
        return this.sampleTypesDatasource.create(data);
    }

    edit(data: IEditSampleTypeParams): Observable<IEmptyResponse> {
        return this.sampleTypesDatasource.edit(data);
    }

    inactivate(id: string): Observable<IEmptyResponse> {
        return this.sampleTypesDatasource.inactivate(id);
    }

    activate(id: string): Observable<IEmptyResponse> {
        return this.sampleTypesDatasource.activate(id);
    }
}