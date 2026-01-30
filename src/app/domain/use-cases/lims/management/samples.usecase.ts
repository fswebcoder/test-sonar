import { ISampleDetailResponseEntity } from "@/domain/entities/lims/management/sample-detail-response.entity";
import { ISampleEntity } from "@/domain/entities/lims/management/sample.entity";
import { SamplesRepository } from "@/domain/repositories/lims/management/samples.repository";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SamplesUseCase implements SamplesRepository {
    private readonly samplesRepository = inject(SamplesRepository);

  getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ISampleEntity>>> {
    return this.samplesRepository.getAll(params);
  }

  getById(id: string): Observable<ISampleDetailResponseEntity> {
    return this.samplesRepository.getById(id);
  }
}
