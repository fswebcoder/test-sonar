import { EBigBagSendingOrderStatus } from "@/shared/enums/big-bag-sending-order.enum";

export interface ISendingOrderEntity {
    id:string;
    consecutive:string;
    status:EBigBagSendingOrderStatus;
    createdAt:string;
}