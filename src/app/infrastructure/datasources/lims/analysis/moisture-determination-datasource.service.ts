import { BaseHttpService } from '@/core/providers/base-http.service';
import { ICreateMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/create-moisture-determination-params.entity';
import { ISampleMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-params.entity';
import { ISampleMoistureDeterminationResponseEntity } from '@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-response.entity';
import { IUpdateMoistureDeterminationParamsEntity } from '@/domain/entities/lims/analysis/moisture-determination/update-moisture-determination-params.entity';
import { MoistureDeterminationRepository } from '@/domain/repositories/lims/analysis/moisture-determination.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class MoistureDeterminationService
  extends BaseHttpService<ISampleMoistureDeterminationResponseEntity>
  implements MoistureDeterminationRepository
{
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}analysis/dh/`;

  create(params: ICreateMoistureDeterminationParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(params, '');
  }

  getSample(params: ISampleMoistureDeterminationParamsEntity): Observable<ISampleMoistureDeterminationResponseEntity> {
    return this.get<ISampleMoistureDeterminationResponseEntity>(`${params.sampleId}`);
  }

  update(params: IUpdateMoistureDeterminationParamsEntity): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>(
      {
        ...params,
        sampleCode: undefined
      },
      `${params.sampleCode}`
    );
  }
}
