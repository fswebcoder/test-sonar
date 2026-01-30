import { BaseHttpService } from '@/core/providers/base-http.service';
import { ICompletePendingReceptionParamsEntity } from '@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity';
import { IListPendingReceptionsResponseEntity } from '@/domain/entities/lims/receptions/pending-receptions/list-pending-receptions-response.entity';
import { PendingReceptionsRepository } from '@/domain/repositories/lims/receptions/pending-receptions/pending-receptions.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class PendingReceptionsDatasourceService
  extends BaseHttpService<unknown>
  implements PendingReceptionsRepository
{
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}sample-receptions/`;

  getAll(): Observable<IListPendingReceptionsResponseEntity> {
    return this.get<IListPendingReceptionsResponseEntity>('pending-sample-reception');
  }

  completePendingReception(params: ICompletePendingReceptionParamsEntity): Observable<IEmptyResponse> {
    const { sampleCode, ...body } = params;
    return this.patch<IEmptyResponse>(body, `${sampleCode}/receive`);
  }
}
