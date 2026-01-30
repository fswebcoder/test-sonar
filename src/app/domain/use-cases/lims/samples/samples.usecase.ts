import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { ISamplesReceptionParamsEntity } from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { SamplesRepository } from '@/domain/repositories/lims/samples/samples.repository';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplesUseCase implements SamplesRepository {
  private readonly samplesRepository = inject(SamplesRepository);
  create(args: ISamplesReceptionParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>> {
    return this.samplesRepository.create(args);
  }

  repeatSample(args: IRepeateSampleParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>> {
    return this.samplesRepository.repeatSample(args);
  }

}
