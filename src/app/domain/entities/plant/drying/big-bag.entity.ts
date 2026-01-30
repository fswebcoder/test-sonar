import { EBigBagStatus } from "@/shared/enums/big-bag-status.enum";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { IBigBagSealEntity } from "./big-bag-seal.entity";

export interface IBigBagEntity {
    id: string;
    expectedTime: string;
    consecutive: string;
    mine: IIdName;
    filledWeight: string;
    loadWeight: string;
    downloadWeight: string;
    deliveryDate: string;
    bigBagType: IIdName;
    status: EBigBagStatus;
    sealRecord: IBigBagSealEntity[];
}