import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISupplierNotificationConfigEntity } from "./supplier-notification-config.entity";

export interface IListNotificationConfigsResponseEntity extends IFlexibleApiResponse<ISupplierNotificationConfigEntity, "list"> {}
