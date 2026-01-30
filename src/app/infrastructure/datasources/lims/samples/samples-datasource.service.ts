import { BaseHttpService } from '@/core/providers/base-http.service';
import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { ISamplesReceptionParamsEntity } from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { SamplesRepository } from '@/domain/repositories/lims/samples/samples.repository';
import { inject, Injectable } from '@angular/core';

import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class SamplesDatasourceService
  extends BaseHttpService<ISamplesReceptionParamsEntity>
  implements SamplesRepository
{
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}`;

  create(args: ISamplesReceptionParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>> {
    return this.post<IGeneralResponse<ISampleReceptionResponseContent>>(args, 'sample-receptions');
  }

  repeatSample(args: IRepeateSampleParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>> {
    return this.post<IGeneralResponse<ISampleReceptionResponseContent>>(args, 'sample-receptions/repeated-sample');
  }
}
