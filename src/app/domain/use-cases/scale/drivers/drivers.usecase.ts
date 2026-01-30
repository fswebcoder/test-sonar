import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { DriversRepository } from "@/domain/repositories/scale/drivers/drivers.repository";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListDriversResponseEntity } from "@/domain/entities/scale/drivers/list-drivers-response.entity";
import { ICreateDriverParamsEntity } from "@/domain/entities/scale/drivers/create-driver-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IUpdateDriverParamsEntity } from "@/domain/entities/scale/drivers/update-driver-params.entity";
import { IDriverEntity } from "@/domain/entities/scale/drivers/driver.entity";

@Injectable({
  providedIn: "root"
})
export class DriversUsecase implements DriversRepository {
  private readonly driversRepository = inject(DriversRepository);

  create(data: ICreateDriverParamsEntity): Observable<IEmptyResponse> {
    return this.driversRepository.create(data);
  }

  createDriverForSupplier(data: ICreateDriverParamsEntity): Observable<IEmptyResponse> {
    return this.driversRepository.createDriverForSupplier(data);
  }

  getAll(params: TPaginationParams): Observable<IListDriversResponseEntity> {
    return this.driversRepository.getAll(params);
  }

  update(params: IUpdateDriverParamsEntity): Observable<IEmptyResponse> {
    return this.driversRepository.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.driversRepository.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.driversRepository.activate(id);
  }

  getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IDriverEntity | null>> {
    return this.driversRepository.getByDocumentNumber(documentNumber);
  }
}
