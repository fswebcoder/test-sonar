import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

import { BaseHttpService } from "@/core/providers/base-http.service";
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
export class SupplierContactsDatasourceService extends BaseHttpService<undefined> {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}`;

  getAll(): Observable<IListSupplierContactsResponseEntity> {
    return this.get<IListSupplierContactsResponseEntity>("supplier-contacts");
  }

  getById(contactId: string): Observable<IGetSupplierContactResponseEntity> {
    return this.get<IGetSupplierContactResponseEntity>(`supplier-contacts/${contactId}`);
  }

  create(params: ICreateSupplierContactParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(params, "supplier-contacts");
  }

  update(params: IUpdateSupplierContactParamsEntity): Observable<IEmptyResponse> {
    const { id, ...data } = params;
    return this.patch<IEmptyResponse>(data, `supplier-contacts/${id}`);
  }

  activate(contactId: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>({}, `supplier-contacts/${contactId}/activate`);
  }

  inactivate(contactId: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`supplier-contacts/${contactId}`);
  }
}
