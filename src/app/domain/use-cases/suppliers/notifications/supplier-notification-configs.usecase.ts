import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { SupplierNotificationConfigsRepository } from "@/domain/repositories/suppliers/notifications/supplier-notification-configs.repository";
import {
  IListNotificationConfigsResponseEntity,
  IGetNotificationConfigResponseEntity,
  ICreateNotificationConfigParamsEntity,
  IListNotificationTypesResponseEntity
} from "@/domain/entities/suppliers/notifications";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

@Injectable({
  providedIn: "root"
})
export class SupplierNotificationConfigsUseCase implements SupplierNotificationConfigsRepository {
  private readonly repository = inject(SupplierNotificationConfigsRepository);

  getAll(): Observable<IListNotificationConfigsResponseEntity> {
    return this.repository.getAll();
  }

  getById(configId: string): Observable<IGetNotificationConfigResponseEntity> {
    return this.repository.getById(configId);
  }

  getNotificationTypes(): Observable<IListNotificationTypesResponseEntity> {
    return this.repository.getNotificationTypes();
  }

  create(params: ICreateNotificationConfigParamsEntity): Observable<IEmptyResponse> {
    return this.repository.create(params);
  }

  activate(configId: string): Observable<IEmptyResponse> {
    return this.repository.activate(configId);
  }

  inactivate(configId: string): Observable<IEmptyResponse> {
    return this.repository.inactivate(configId);
  }
}
