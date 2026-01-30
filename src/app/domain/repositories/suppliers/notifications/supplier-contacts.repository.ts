import { Observable } from "rxjs";

import {
  IListSupplierContactsResponseEntity,
  IGetSupplierContactResponseEntity,
  ICreateSupplierContactParamsEntity,
  IUpdateSupplierContactParamsEntity
} from "@/domain/entities/suppliers/notifications";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

export abstract class SupplierContactsRepository {
  abstract getAll(): Observable<IListSupplierContactsResponseEntity>;
  abstract getById(contactId: string): Observable<IGetSupplierContactResponseEntity>;
  abstract create(params: ICreateSupplierContactParamsEntity): Observable<IEmptyResponse>;
  abstract update(params: IUpdateSupplierContactParamsEntity): Observable<IEmptyResponse>;
  abstract activate(contactId: string): Observable<IEmptyResponse>;
  abstract inactivate(contactId: string): Observable<IEmptyResponse>;
}
