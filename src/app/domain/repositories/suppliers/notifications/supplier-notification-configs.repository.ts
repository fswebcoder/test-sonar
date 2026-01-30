import { Observable } from "rxjs";

import {
  IListNotificationConfigsResponseEntity,
  IGetNotificationConfigResponseEntity,
  ICreateNotificationConfigParamsEntity,
  IListNotificationTypesResponseEntity
} from "@/domain/entities/suppliers/notifications";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

export abstract class SupplierNotificationConfigsRepository {
  abstract getAll(): Observable<IListNotificationConfigsResponseEntity>;
  abstract getById(configId: string): Observable<IGetNotificationConfigResponseEntity>;
  abstract getNotificationTypes(): Observable<IListNotificationTypesResponseEntity>;
  abstract create(params: ICreateNotificationConfigParamsEntity): Observable<IEmptyResponse>;
  abstract activate(configId: string): Observable<IEmptyResponse>;
  abstract inactivate(configId: string): Observable<IEmptyResponse>;
}
