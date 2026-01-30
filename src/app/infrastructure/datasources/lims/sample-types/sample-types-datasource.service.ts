import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { ICreateSampleTypeParams } from "@/domain/entities/lims/sample-types/create-sample-type-params.entity";
import { IEditSampleTypeParams } from "@/domain/entities/lims/sample-types/edit-sample-type-params.entity";
import { IListSampleTypesParamsEntity } from "@/domain/entities/lims/sample-types/list-sample-types-params.entity";
import { IListSampleTypesResponseEntity } from "@/domain/entities/lims/sample-types/list-sample-types-response.entity";
import { SampleTypeRepository } from "@/domain/repositories/lims/sample-types/sample-types.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: 'root'
})
export class SampleTypesDatasourceService extends BaseHttpService<unknown> implements SampleTypeRepository {
    private readonly env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}sample-type/`;

    getAll(params: IListSampleTypesParamsEntity): Observable<IListSampleTypesResponseEntity> {
        return this.get<IListSampleTypesResponseEntity>('', {params: buildHttpParams(params)});
    }

    create(data: ICreateSampleTypeParams): Observable<IEmptyResponse> {
        return this.post<IEmptyResponse>(data, 'create' );
    }

    edit(data: IEditSampleTypeParams): Observable<IEmptyResponse> {
        const { id, isActive, ...rest } = data;
        return this.patch<IEmptyResponse>(rest, `${id}`);
    }

    inactivate(id: string): Observable<IEmptyResponse> {
        return this.delete<IEmptyResponse>(`${id}`);
    }

    activate(id: string): Observable<IEmptyResponse> {
        return this.patch<IEmptyResponse>({}, `activate/${id}`);
    }

}