import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IGeneralResponse, PaginatedData, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ISampleEntity } from "@/domain/entities/lims/management/sample.entity";
import { IGetById } from "@/shared/interfaces/get-by-id.interface";
import { ISampleDetailResponseEntity } from "@/domain/entities/lims/management/sample-detail-response.entity";
import ISampleDetailEntity from "@/domain/entities/lims/management/sample-detail.entity";
export abstract class SamplesRepository implements IGetAll<ISampleEntity, true>, IGetById<ISampleDetailEntity> {
    abstract getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ISampleEntity>>>;
    abstract getById(id: string): Observable<ISampleDetailResponseEntity>;
}
