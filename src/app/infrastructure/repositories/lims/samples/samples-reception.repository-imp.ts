import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { ISamplesReceptionParamsEntity } from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { SamplesRepository } from '@/domain/repositories/lims/samples/samples.repository';
import { SamplesDatasourceService } from '@/infrastructure/datasources/lims/samples/samples-datasource.service';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplesReceptionRepository implements SamplesRepository {
  private readonly samplesDatasourceService = inject(SamplesDatasourceService);
  create(args: ISamplesReceptionParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>> {
    return this.samplesDatasourceService.create(args);
  }

  repeatSample(args: IRepeateSampleParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>> {
    return this.samplesDatasourceService.repeatSample(args);
  }

}
