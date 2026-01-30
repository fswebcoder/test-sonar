import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISupplierNotificationConfigEntity } from "./supplier-notification-config.entity";

export interface IGetNotificationConfigResponseEntity extends IFlexibleApiResponse<ISupplierNotificationConfigEntity, "single"> {}
