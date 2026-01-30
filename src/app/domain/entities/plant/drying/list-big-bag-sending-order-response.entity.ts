import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISendingOrderEntity } from "./sending-order.entity";

export interface IListBigBagSendingOrderResponseEntity extends IFlexibleApiResponse<ISendingOrderEntity, "paginated">{}