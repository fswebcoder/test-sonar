import { BaseHttpService } from '@/core/providers/base-http.service';
import { IQuarteringParamsEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-params.entity';
import { ISampleQuarteringDetailsResponseEntity } from '@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity';
import { QuarteringsReceptionRepository } from '@/domain/repositories/lims/receptions/quarterings/quarterings-reception.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class QuarteringsReceptionsDatasourceService
  extends BaseHttpService<null>
  implements QuarteringsReceptionRepository
{
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}sample-quartering/`;

  create(data: IQuarteringParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(data, 'create-sample-quartering');
  }

  getById(id: string): Observable<IGeneralResponse<ISampleQuarteringDetailsResponseEntity>> {
    return this.get<IGeneralResponse<ISampleQuarteringDetailsResponseEntity>>(`details/${id}`);
  }
}
