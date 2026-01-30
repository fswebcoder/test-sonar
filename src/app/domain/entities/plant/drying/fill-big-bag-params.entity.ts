import { IBigBagEntity } from "./big-bag.entity";

export interface IFillBigBagParamsEntity extends Pick<IBigBagEntity, "expectedTime" | "filledWeight">{
    sealSecurity: string;
    mineId: string;
    bigBagTypeId: string;
}