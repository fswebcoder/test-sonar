import { EBigBagStatus } from "@/shared/enums/big-bag-status.enum";
import { TPaginationParams } from "@SV-Development/utilities";

export interface IListBigBagsParamsEntity extends TPaginationParams {
    mineId?: string;
    status?: EBigBagStatus[];
}