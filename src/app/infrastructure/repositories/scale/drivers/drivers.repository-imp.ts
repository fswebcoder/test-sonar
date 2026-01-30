import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DriversRepository } from "@/domain/repositories/scale/drivers/drivers.repository";
import { DriversDatasourceService } from "@/infrastructure/datasources/scale/drivers/drivers-datasource.service";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListDriversResponseEntity } from "@/domain/entities/scale/drivers/list-drivers-response.entity";
import { ICreateDriverParamsEntity } from "@/domain/entities/scale/drivers/create-driver-params.entity";
import { IUpdateDriverParamsEntity } from "@/domain/entities/scale/drivers/update-driver-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IDriverEntity } from "@/domain/entities/scale/drivers/driver.entity";

@Injectable({
  providedIn: "root"
})
export class DriversRepositoryImp extends DriversRepository {
  private readonly driversDatasource = inject(DriversDatasourceService);

  create(data: ICreateDriverParamsEntity): Observable<IEmptyResponse> {
    return this.driversDatasource.create(data);
  }

  createDriverForSupplier(data: ICreateDriverParamsEntity): Observable<IEmptyResponse> {
    return this.driversDatasource.createDriverForSupplier(data);
  }

  getAll(params: TPaginationParams): Observable<IListDriversResponseEntity> {
    return this.driversDatasource.getAll(params);
  }

  update(params: IUpdateDriverParamsEntity): Observable<IEmptyResponse> {
    return this.driversDatasource.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.driversDatasource.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.driversDatasource.activate(id);
  }

  getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IDriverEntity | null>> {
    return this.driversDatasource.getByDocumentNumber(documentNumber);
  }
}
