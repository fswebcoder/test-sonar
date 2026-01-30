import { BaseHttpService } from '@core/providers/base-http.service';
import {
  SampleSendingRepository
} from '@/domain/repositories/lims/receptions/sample-sending/sample-sending.repository';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from 'src/app.config';
import {
  ICreateSampleSendingParamsEntity
} from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-params.entity';
import { Observable } from 'rxjs';
import {
  ICreateSampleSendingResponseEntity
} from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-response.entity';

@Injectable({
  providedIn: 'root'
})
export class SampleSendingDatasourceService extends BaseHttpService<unknown> implements SampleSendingRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}send-sample/`;

  createSampleSending(
    params: ICreateSampleSendingParamsEntity
  ): Observable<ICreateSampleSendingResponseEntity> {
    return  this.post<ICreateSampleSendingResponseEntity>(params, "")
  }
}
