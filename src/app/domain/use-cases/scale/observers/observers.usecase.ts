import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ObserversRepository } from "@/domain/repositories/scale/observers/observers.repository";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListObserversResponseEntity } from "@/domain/entities/scale/observers/list-observers-response.entity";
import { ICreateObserverParamsEntity } from "@/domain/entities/scale/observers/create-observer-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IUpdateObserverParamsEntity } from "@/domain/entities/scale/observers/update-observer-params.entity";
import { IObserverEntity } from "@/domain/entities/scale/observers/observer.entity";

@Injectable({
  providedIn: "root"
})
export class ObserversUsecase implements ObserversRepository {
  private readonly observersRepository = inject(ObserversRepository);

  create(data: ICreateObserverParamsEntity): Observable<IEmptyResponse> {
    return this.observersRepository.create(data);
  }

  createObserverForSupplier(data: ICreateObserverParamsEntity): Observable<IEmptyResponse> {
    return this.observersRepository.createObserverForSupplier(data);
  }

  getAll(params: TPaginationParams): Observable<IListObserversResponseEntity> {
    return this.observersRepository.getAll(params);
  }

  update(params: IUpdateObserverParamsEntity): Observable<IEmptyResponse> {
    return this.observersRepository.update(params);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.observersRepository.desactivate(id);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.observersRepository.activate(id);
  }

  getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IObserverEntity | null>> {
    return this.observersRepository.getByDocumentNumber(documentNumber);
  }
}
