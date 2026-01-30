import { IFireTestParamsEntity } from "@/domain/entities/lims/analysis/fire-test/fire-test-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { Observable } from "rxjs";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

export abstract class FireTestRepository implements ICreateData<IFireTestParamsEntity, null>{
    abstract create(params: IFireTestParamsEntity): Observable<IEmptyResponse>;
    abstract updateDoreWeight(sampleId: string, doreWeight: number): Observable<IEmptyResponse>;
}