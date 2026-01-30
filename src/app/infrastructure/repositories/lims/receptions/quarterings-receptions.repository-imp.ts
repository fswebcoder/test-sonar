import { IQuarteringParamsEntity } from "@/domain/entities/lims/receptions/quarterings/quartering-params.entity";
import { ISampleQuarteringDetailsResponseEntity } from "@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity";
import { QuarteringsReceptionRepository } from "@/domain/repositories/lims/receptions/quarterings/quarterings-reception.repository";
import { QuarteringsReceptionsDatasourceService } from "@/infrastructure/datasources/lims/receptions/quarterings-receptions-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuarteringsReceptionsRepositoryImp implements QuarteringsReceptionRepository {
  quarteringsReceptionsDatasourceService = inject(QuarteringsReceptionsDatasourceService);

  create(data: IQuarteringParamsEntity): Observable<IEmptyResponse> {
    return this.quarteringsReceptionsDatasourceService.create(data);
  } 
  getById(id: string): Observable<IGeneralResponse<ISampleQuarteringDetailsResponseEntity>> {
    return this.quarteringsReceptionsDatasourceService.getById(id);
  }
}