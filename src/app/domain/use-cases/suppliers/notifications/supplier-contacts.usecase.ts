import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { SupplierContactsRepository } from "@/domain/repositories/suppliers/notifications/supplier-contacts.repository";
import {
  IListSupplierContactsResponseEntity,
  IGetSupplierContactResponseEntity,
  ICreateSupplierContactParamsEntity,
  IUpdateSupplierContactParamsEntity
} from "@/domain/entities/suppliers/notifications";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

@Injectable({
  providedIn: "root"
})
export class SupplierContactsUseCase implements SupplierContactsRepository {
  private readonly repository = inject(SupplierContactsRepository);

  getAll(): Observable<IListSupplierContactsResponseEntity> {
    return this.repository.getAll();
  }

  getById(contactId: string): Observable<IGetSupplierContactResponseEntity> {
    return this.repository.getById(contactId);
  }

  create(params: ICreateSupplierContactParamsEntity): Observable<IEmptyResponse> {
    return this.repository.create(params);
  }

  update(params: IUpdateSupplierContactParamsEntity): Observable<IEmptyResponse> {
    return this.repository.update(params);
  }

  activate(contactId: string): Observable<IEmptyResponse> {
    return this.repository.activate(contactId);
  }

  inactivate(contactId: string): Observable<IEmptyResponse> {
    return this.repository.inactivate(contactId);
  }
}
