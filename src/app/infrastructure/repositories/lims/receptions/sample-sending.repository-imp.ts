import {
  SampleSendingRepository
} from '@/domain/repositories/lims/receptions/sample-sending/sample-sending.repository';
import {
  SampleSendingDatasourceService
} from '@/infrastructure/datasources/lims/receptions/sample-sending-datasource.service';
import { inject, Injectable } from '@angular/core';
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
export class SampleSendingRepositoryImp implements SampleSendingRepository {
  private sampleSendingDatasourceService: SampleSendingDatasourceService = inject(SampleSendingDatasourceService);

  createSampleSending(
    params: ICreateSampleSendingParamsEntity
  ): Observable<ICreateSampleSendingResponseEntity> {
    return this.sampleSendingDatasourceService.createSampleSending(params)
  }
  
}
