import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

import { BaseHttpService } from "@/core/providers/base-http.service";
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
export class SupplierNotificationConfigsDatasourceService extends BaseHttpService<undefined> {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}`;

  getAll(): Observable<IListNotificationConfigsResponseEntity> {
    return this.get<IListNotificationConfigsResponseEntity>("supplier-notification-configs");
  }

  getById(configId: string): Observable<IGetNotificationConfigResponseEntity> {
    return this.get<IGetNotificationConfigResponseEntity>(`supplier-notification-configs/${configId}`);
  }

  getNotificationTypes(): Observable<IListNotificationTypesResponseEntity> {
    return this.get<IListNotificationTypesResponseEntity>("common/catalogs/NOTIFICATION_TYPES");
  }

  create(params: ICreateNotificationConfigParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(params, "supplier-notification-configs");
  }

  activate(configId: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>({}, `supplier-notification-configs/${configId}/activate`);
  }

  inactivate(configId: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`supplier-notification-configs/${configId}`);
  }
}
