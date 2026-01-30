import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { INotificationTypeEntity } from "./notification-type.entity";

export interface IListNotificationTypesResponseEntity extends IFlexibleApiResponse<INotificationTypeEntity, "list"> {}
