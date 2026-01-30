import { BaseHttpService } from '@/core/providers/base-http.service';
import { buildHttpParams } from '@/core/utils/build-http-params';
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
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class LeachwellService extends BaseHttpService<ILeachwellResponseEntity> implements LeachwellRepository {
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}analysis/`;

  create(args: ILeachwellParamsEntity): Observable<IGeneralResponse<ILeachwellResponseEntity>> {
    return this.post<IGeneralResponse<ILeachwellResponseEntity>>(args, 'lw');
  }

  getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ILeachwellResponseEntity>>> {
    return this.get<IGeneralResponse<PaginatedData<ILeachwellResponseEntity>>>(`active-leachwell`, {
      params: buildHttpParams(params)
    });
  }

  complete(args: ILeachwellCompleteParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(
      {
          sampleCode: args.id,
      },
      `lw/finish`
    );
  }
}
