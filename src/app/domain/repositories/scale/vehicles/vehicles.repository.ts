import { ICreateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/create-vehicle-params.entity";
import { IListVehiclesResponse } from "@/domain/entities/scale/vehicles/list-vehicles-response.entity";
import { IUpdateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/update-vehicle-params.entity";
import { IVehicle } from "@/domain/entities/scale/vehicles/vehicle.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export abstract class VehiclesRepository implements IGetAll<IVehicle, true>, ICreateData<ICreateVehicleParamsEntity, null>{
    abstract getAll(params: TPaginationParams): Observable<IListVehiclesResponse>;
    abstract getByPlate(plate: string): Observable<IGeneralResponse<IVehicle | null>>;
    abstract create(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse>;
    abstract createVehicleForSupplier(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse>;
    abstract update(params: IUpdateVehicleParamsEntity): Observable<IEmptyResponse>;
    abstract desactivate(id: string): Observable<IEmptyResponse>;
    abstract activate(id: string): Observable<IEmptyResponse>;
}