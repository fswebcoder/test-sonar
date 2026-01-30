import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { ICreateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/create-vehicle-params.entity";
import { IListVehiclesResponse } from "@/domain/entities/scale/vehicles/list-vehicles-response.entity";
import { IUpdateVehicleParamsEntity } from "@/domain/entities/scale/vehicles/update-vehicle-params.entity";
import { IVehicle } from "@/domain/entities/scale/vehicles/vehicle.entity";
import { VehiclesRepository } from "@/domain/repositories/scale/vehicles/vehicles.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: "root"
})
export class VehiclesDatasourceService extends BaseHttpService<undefined> implements VehiclesRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}vehicles/`;

  getAll(params: TPaginationParams): Observable<IListVehiclesResponse> {
    return this.get<IListVehiclesResponse>("", { params: buildHttpParams(params) });
  }

  create(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse> {
    const formData = new FormData();
    formData.append('plate', data.plate);
    formData.append('vehicleTypeId', data.vehicleTypeId);

    if (data.soat instanceof File) formData.append('soat', data.soat);
    if (data.technomechanical instanceof File) formData.append('technomechanical', data.technomechanical);
    if (data.registration instanceof File) formData.append('registration', data.registration);

    return this.post<IEmptyResponse>(formData);
  }

  createVehicleForSupplier(data: ICreateVehicleParamsEntity): Observable<IEmptyResponse> {
    const formData = new FormData();
    formData.append('plate', data.plate);
    formData.append('vehicleTypeId', data.vehicleTypeId);

    if (data.soat instanceof File) formData.append('soat', data.soat);
    if (data.technomechanical instanceof File) formData.append('technomechanical', data.technomechanical);
    if (data.registration instanceof File) formData.append('registration', data.registration);

    return this.post<IEmptyResponse>(formData, 'create-vehicle-supplier');
  }

  update(params: IUpdateVehicleParamsEntity): Observable<IEmptyResponse> {
    const { id, documents, ...payload } = params;

    const soat = documents?.soat;
    const technomechanical = documents?.technomechanical;
    const registration = documents?.registration;

    const hasFiles = soat instanceof File || technomechanical instanceof File || registration instanceof File;

    if (!hasFiles) {
      return this.patch<IEmptyResponse>(payload, `${id}`);
    }

    const formData = new FormData();
    if (payload.plate !== undefined) formData.append('plate', String(payload.plate));
    if (payload.vehicleTypeId !== undefined) formData.append('vehicleTypeId', String(payload.vehicleTypeId));
    if (soat instanceof File) formData.append('soat', soat);
    if (technomechanical instanceof File) formData.append('technomechanical', technomechanical);
    if (registration instanceof File) formData.append('registration', registration);

    return this.patch<IEmptyResponse>(formData, `${id}`);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`${id}`);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>(undefined, `activate/${id}`);
  }

  getByPlate(plate: string): Observable<IGeneralResponse<IVehicle | null>> {
    return this.get<IGeneralResponse<IVehicle | null>>(`find-by-plate/${plate}`);
  }
}
