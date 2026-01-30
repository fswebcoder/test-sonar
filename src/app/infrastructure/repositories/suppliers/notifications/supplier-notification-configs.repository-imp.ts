import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { SupplierNotificationConfigsRepository } from "@/domain/repositories/suppliers/notifications/supplier-notification-configs.repository";
import { SupplierNotificationConfigsDatasourceService } from "@/infrastructure/datasources/suppliers/notifications/supplier-notification-configs-datasource.service";
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
export class SupplierNotificationConfigsRepositoryImp extends SupplierNotificationConfigsRepository {
  private readonly datasource = inject(SupplierNotificationConfigsDatasourceService);

  getAll(): Observable<IListNotificationConfigsResponseEntity> {
    return this.datasource.getAll();
  }

  getById(configId: string): Observable<IGetNotificationConfigResponseEntity> {
    return this.datasource.getById(configId);
  }

  getNotificationTypes(): Observable<IListNotificationTypesResponseEntity> {
    return this.datasource.getNotificationTypes();
  }

  create(params: ICreateNotificationConfigParamsEntity): Observable<IEmptyResponse> {
    return this.datasource.create(params);
  }

  activate(configId: string): Observable<IEmptyResponse> {
    return this.datasource.activate(configId);
  }

  inactivate(configId: string): Observable<IEmptyResponse> {
    return this.datasource.inactivate(configId);
  }
}
