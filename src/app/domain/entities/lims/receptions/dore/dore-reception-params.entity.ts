import { IDoreRegisterEntity } from "./dore-register.entity";

export interface IDoreReceptionParamsEntity {
    supplierId: string;
    sampleTypeId: string;
    miningTitleId: string;
    cityId: string;
    receptionDate: string;
    batchNumber: string;
    observation: string;
    items: IDoreRegisterEntity[]
}