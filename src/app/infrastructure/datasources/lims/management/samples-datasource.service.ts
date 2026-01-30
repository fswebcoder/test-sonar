import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { ISampleDetailResponseEntity } from "@/domain/entities/lims/management/sample-detail-response.entity";
import { ISampleEntity } from "@/domain/entities/lims/management/sample.entity";
import { SamplesRepository } from "@/domain/repositories/lims/management/samples.repository";
import { HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: 'root'
})
export class SamplesDatasourceService extends BaseHttpService<SamplesRepository> implements SamplesRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}sample-management/`;

    getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ISampleEntity>>> {
        const paramsToSend: any = buildHttpParams(params);

        return this.get<IGeneralResponse<PaginatedData<ISampleEntity>>>('find-by-filters', {
            params: paramsToSend as unknown as HttpParams,
        });
    }
    getById(id: string): Observable<ISampleDetailResponseEntity> {
        return this.get<ISampleDetailResponseEntity>(`details/${id}`);
    }
}
