import {
  ILeachwellCompleteParamsEntity,
  ILeachwellParamsEntity
} from '@/domain/entities/lims/analysis/leachwell/leachwell-params.entity';
import { ILeachwellResponseEntity } from '@/domain/entities/lims/analysis/leachwell/leachwell-response-entity';
import { LeachwellRepository } from '@/domain/repositories/lims/analysis/leachwell.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';

import { IGeneralResponse, PaginatedData, TPaginationParams } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeachwellUseCase implements LeachwellRepository {
  private readonly leachwellRepository = inject(LeachwellRepository);

  create(params: ILeachwellParamsEntity): Observable<IGeneralResponse<ILeachwellResponseEntity>> {
    return this.leachwellRepository.create(params);
  }

  getAll(params: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ILeachwellResponseEntity>>> {
    return this.leachwellRepository.getAll(params);
  }

  complete(params: ILeachwellCompleteParamsEntity): Observable<IEmptyResponse> {
    return this.leachwellRepository.complete(params);
  }
}
