import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ObserversRepository } from "@/domain/repositories/scale/observers/observers.repository";
import { ObserversDatasourceService } from "@/infrastructure/datasources/scale/observers/observers-datasource.service";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListObserversResponseEntity } from "@/domain/entities/scale/observers/list-observers-response.entity";
import { ICreateObserverParamsEntity } from "@/domain/entities/scale/observers/create-observer-params.entity";
import { IUpdateObserverParamsEntity } from "@/domain/entities/scale/observers/update-observer-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IObserverEntity } from "@/domain/entities/scale/observers/observer.entity";

@Injectable({
  providedIn: "root"
})
export class ObserversRepositoryImp extends ObserversRepository {
  private readonly observersDatasource = inject(ObserversDatasourceService);

  create(data: ICreateObserverParamsEntity): Observable<IEmptyResponse> {
    return this.observersDatasource.create(data);
  }

  createObserverForSupplier(data: ICreateObserverParamsEntity): Observable<IEmptyResponse> {
    return this.observersDatasource.createObserverForSupplier(data);
  }

  getAll(params: TPaginationParams): Observable<IListObserversResponseEntity> {
    return this.observersDatasource.getAll(params);
  }

  update(params: IUpdateObserverParamsEntity): Observable<IEmptyResponse> {
    return this.observersDatasource.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.observersDatasource.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.observersDatasource.activate(id);
  }

  getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IObserverEntity | null>> {
    return this.observersDatasource.getByDocumentNumber(documentNumber);
  }
}
