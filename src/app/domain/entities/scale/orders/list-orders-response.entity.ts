import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IOrderEntity } from "./order.entity";

export interface IListOrdersResponseEntity extends IFlexibleApiResponse<IOrderEntity, "paginated"> {
}
