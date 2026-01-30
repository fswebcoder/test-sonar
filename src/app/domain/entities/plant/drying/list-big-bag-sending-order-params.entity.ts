import { EBigBagSendingOrderStatus } from "@/shared/enums/big-bag-sending-order.enum";
import { TPaginationParams } from "@SV-Development/utilities";

export interface IListBigBagSendingOrderParamsEntity extends TPaginationParams{
    status?: EBigBagSendingOrderStatus[];
}