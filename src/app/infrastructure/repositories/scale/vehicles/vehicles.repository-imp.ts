import { ICreateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/create-vehicle-params.entity";
import { IListVehiclesResponse } from "@/domain/entities/scale/vehicles/list-vehicles-response.entity";
import { IUpdateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/update-vehicle-params.entity";
import { IVehicle } from "@/domain/entities/scale/vehicles/vehicle.entity";
import { VehiclesRepository } from "@/domain/repositories/scale/vehicles/vehicles.repository";
import { VehiclesDatasourceService } from "@/infrastructure/datasources/scale/vehicles/vehicles-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class VehiclesRepositoryImp extends VehiclesRepository {
  private readonly vehiclesDatasource = inject(VehiclesDatasourceService);

  getAll(params: TPaginationParams): Observable<IListVehiclesResponse> {
    return this.vehiclesDatasource.getAll(params);
  }

  create(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse> {
    return this.vehiclesDatasource.create(data);
  }

  createVehicleForSupplier(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse> {
    return this.vehiclesDatasource.createVehicleForSupplier(data);
  }

  update(params: IUpdateVehicleParamsEntity): Observable<IEmptyResponse> {
    return this.vehiclesDatasource.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.vehiclesDatasource.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.vehiclesDatasource.activate(id);
  }

  getByPlate(plate: string): Observable<IGeneralResponse<IVehicle | null>> {
    return this.vehiclesDatasource.getByPlate(plate);
  }
}
