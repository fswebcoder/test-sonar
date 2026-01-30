import { ICreateMoistureDeterminationParamsEntity } from "@/domain/entities/lims/analysis/moisture-determination/create-moisture-determination-params.entity";
import { ISampleMoistureDeterminationParamsEntity } from "@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-params.entity";
import { ISampleMoistureDeterminationResponseEntity } from "@/domain/entities/lims/analysis/moisture-determination/sample-moisture-determination-response.entity";
import { IUpdateMoistureDeterminationParamsEntity } from "@/domain/entities/lims/analysis/moisture-determination/update-moisture-determination-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Observable } from "rxjs";

export abstract class MoistureDeterminationRepository implements ICreateData<ICreateMoistureDeterminationParamsEntity, null> {
    abstract create(params: ICreateMoistureDeterminationParamsEntity): Observable<IEmptyResponse>;

    abstract getSample(params: ISampleMoistureDeterminationParamsEntity): Observable<ISampleMoistureDeterminationResponseEntity>;

    abstract update(params: IUpdateMoistureDeterminationParamsEntity): Observable<IEmptyResponse>;
}
