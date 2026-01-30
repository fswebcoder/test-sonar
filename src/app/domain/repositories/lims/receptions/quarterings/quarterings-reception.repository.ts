import { IQuarteringParamsEntity } from "@/domain/entities/lims/receptions/quarterings/quartering-params.entity";
import { ISampleQuarteringDetailsResponseEntity } from "@/domain/entities/lims/receptions/quarterings/sample-quartering-details-reponse.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export abstract class QuarteringsReceptionRepository implements ICreateData<IQuarteringParamsEntity, null> {
  abstract create(data: IQuarteringParamsEntity): Observable<IEmptyResponse>;
  abstract getById(id: string): Observable<IGeneralResponse<ISampleQuarteringDetailsResponseEntity>>;
}
