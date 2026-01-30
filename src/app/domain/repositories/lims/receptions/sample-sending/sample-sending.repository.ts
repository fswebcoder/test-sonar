import {
  ICreateSampleSendingParamsEntity
} from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-params.entity';
import { Observable } from 'rxjs';
import {
  ICreateSampleSendingResponseEntity
} from '@/domain/entities/lims/receptions/sample-sending/create-sample-sending-response.entity';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class SampleSendingRepository {
  abstract createSampleSending(params: ICreateSampleSendingParamsEntity): Observable<ICreateSampleSendingResponseEntity>
}
