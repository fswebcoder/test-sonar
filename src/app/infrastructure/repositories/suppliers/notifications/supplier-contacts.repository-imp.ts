import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { SupplierContactsRepository } from "@/domain/repositories/suppliers/notifications/supplier-contacts.repository";
import { SupplierContactsDatasourceService } from "@/infrastructure/datasources/suppliers/notifications/supplier-contacts-datasource.service";
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
export class SupplierContactsRepositoryImp extends SupplierContactsRepository {
  private readonly datasource = inject(SupplierContactsDatasourceService);

  getAll(): Observable<IListSupplierContactsResponseEntity> {
    return this.datasource.getAll();
  }

  getById(contactId: string): Observable<IGetSupplierContactResponseEntity> {
    return this.datasource.getById(contactId);
  }

  create(params: ICreateSupplierContactParamsEntity): Observable<IEmptyResponse> {
    return this.datasource.create(params);
  }

  update(params: IUpdateSupplierContactParamsEntity): Observable<IEmptyResponse> {
    return this.datasource.update(params);
  }

  activate(contactId: string): Observable<IEmptyResponse> {
    return this.datasource.activate(contactId);
  }

  inactivate(contactId: string): Observable<IEmptyResponse> {
    return this.datasource.inactivate(contactId);
  }
}
