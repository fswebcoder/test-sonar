import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { VehiclesRepository } from "@/domain/repositories/scale/vehicles/vehicles.repository";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListVehiclesResponse } from "@/domain/entities/scale/vehicles/list-vehicles-response.entity";
import { ICreateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/create-vehicle-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IUpdateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/update-vehicle-params.entity";
import { IVehicle } from "@/domain/entities/scale/vehicles/vehicle.entity";

@Injectable({
  providedIn: "root"
})
export class VehiclesUsecase implements VehiclesRepository {
  private readonly vehiclesRepository = inject(VehiclesRepository);

  getAll(params: TPaginationParams): Observable<IListVehiclesResponse> {
    return this.vehiclesRepository.getAll(params);
  }

  create(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse> {
    return this.vehiclesRepository.create(data);
  }

  createVehicleForSupplier(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse> {
    return this.vehiclesRepository.createVehicleForSupplier(data);
  }

  update(params: IUpdateVehicleParamsEntity): Observable<IEmptyResponse> {
    return this.vehiclesRepository.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.vehiclesRepository.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.vehiclesRepository.activate(id);
  }

  getByPlate(plate: string): Observable<IGeneralResponse<IVehicle | null>> {
    return this.vehiclesRepository.getByPlate(plate);
  }
}
