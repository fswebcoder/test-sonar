import { BaseHttpService } from '@/core/providers/base-http.service';
import { LaboratoryReceptionRepository } from '@/domain/repositories/lims/receptions/laboratory/laboratory-receptions-repository';
import { ILaboratoryReceptionParams } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from 'src/app.config';
import { inject, Injectable } from '@angular/core';
import { ILaboratoryReceptionApiResponseEntity } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-response.entity';
import IGetSampleLaboratoryReceptionsResponse from '@/domain/entities/lims/receptions/laboratory/get-sample-laboratory-receptions-response.entity';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryReceptionsDatasourceService
  extends BaseHttpService<ILaboratoryReceptionApiResponseEntity>
  implements LaboratoryReceptionRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}sample-receptions/`;

  analyze(data: ILaboratoryReceptionParams): Observable<ILaboratoryReceptionApiResponseEntity> {
    return this.post<ILaboratoryReceptionApiResponseEntity>(data,`laboratory-reception`
    );
  }

  getSample(sampleCode: string): Observable<IGetSampleLaboratoryReceptionsResponse> {
    return this.get<IGetSampleLaboratoryReceptionsResponse>(`sample-with-default-analyses/${sampleCode}`);
  }
}
