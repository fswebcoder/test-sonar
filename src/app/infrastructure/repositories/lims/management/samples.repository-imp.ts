import { ISampleDetailResponseEntity } from "@/domain/entities/lims/management/sample-detail-response.entity";
import { ISampleEntity } from "@/domain/entities/lims/management/sample.entity";
import { SamplesRepository } from "@/domain/repositories/lims/management/samples.repository";
import { SamplesDatasourceService } from "@/infrastructure/datasources/lims/management/samples-datasource.service";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SamplesRepositoryImp implements SamplesRepository {
    private readonly samplesDatasourceService = inject(SamplesDatasourceService)

    getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ISampleEntity>>> {
        return this.samplesDatasourceService.getAll(params);
    }

  getById(id: string): Observable<ISampleDetailResponseEntity> {
    return this.samplesDatasourceService.getById(id);
  }

  
}
