import { IQuarteringParamsEntity } from '@/domain/entities/lims/receptions/quarterings/quartering-params.entity';
import { ISampleQuarteringDetailsResponseEntity } from '@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity';
import { QuarteringsReceptionRepository } from '@/domain/repositories/lims/receptions/quarterings/quarterings-reception.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuarteringsReceptionUseCase implements QuarteringsReceptionRepository {
  quarteringsReceptionRepository = inject(QuarteringsReceptionRepository);

  create(data: IQuarteringParamsEntity): Observable<IEmptyResponse> {
    return this.quarteringsReceptionRepository.create(data);
  }
  getById(id: string): Observable<IGeneralResponse<ISampleQuarteringDetailsResponseEntity>> {
    return this.quarteringsReceptionRepository.getById(id);
  }
}
