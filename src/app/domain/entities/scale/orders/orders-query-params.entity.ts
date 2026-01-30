import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";
import { TPaginationParams } from "@SV-Development/utilities";

export interface IOrdersQueryParams extends TPaginationParams {
    status?: EOrderScaleStatus[];
    operationType?: EOrderScaleType;
}
