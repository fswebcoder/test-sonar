import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISupplierOrderEntity } from "./supplier-order.entity";

export interface IListSupplierOrdersResponseEntity extends IFlexibleApiResponse<ISupplierOrderEntity, "paginated"> {}
