import {
  SampleSendingRepository
} from '@/domain/repositories/lims/receptions/sample-sending/sample-sending.repository';
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
export class SampleSendingUsecase implements SampleSendingRepository {
  sampleSendingRepository: SampleSendingRepository = inject(SampleSendingRepository);

  createSampleSending(
    params: ICreateSampleSendingParamsEntity
  ): Observable<ICreateSampleSendingResponseEntity> {
    return this.sampleSendingRepository.createSampleSending(params)
  }
}
