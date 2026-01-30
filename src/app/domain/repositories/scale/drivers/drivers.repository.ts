import { ICreateDriverParamsEntity } from "@/domain/entities/scale/drivers/create-driver-params.entity";
import { IDriverEntity } from "@/domain/entities/scale/drivers/driver.entity";
import { IListDriversResponseEntity } from "@/domain/entities/scale/drivers/list-drivers-response.entity";
import { IUpdateDriverParamsEntity } from "@/domain/entities/scale/drivers/update-driver-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export abstract class DriversRepository implements ICreateData<ICreateDriverParamsEntity, null>, IGetAll<IDriverEntity, true> {
    abstract create(data: ICreateDriverParamsEntity): Observable<IEmptyResponse>;
    abstract createDriverForSupplier(data: ICreateDriverParamsEntity): Observable<IEmptyResponse>;
    abstract getAll(params: TPaginationParams): Observable<IListDriversResponseEntity>;
    abstract update(params: IUpdateDriverParamsEntity): Observable<IEmptyResponse>;
    abstract desactivate(id: string): Observable<IEmptyResponse>;
    abstract activate(id: string): Observable<IEmptyResponse>;
    abstract getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IDriverEntity | null>>;
}