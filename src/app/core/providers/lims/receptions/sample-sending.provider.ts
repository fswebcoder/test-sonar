import { Provider } from '@angular/core';
import {
  SampleSendingRepository
} from '@/domain/repositories/lims/receptions/sample-sending/sample-sending.repository';
import {
  SampleSendingRepositoryImp
} from '@/infrastructure/repositories/lims/receptions/sample-sending.repository-imp';

export default function sampleSendingProvider():Provider[]{
  return [
    {
      provide: SampleSendingRepository,
      useClass: SampleSendingRepositoryImp
    }
  ]
}
