import { EPlantProcess } from "@/shared/enums/plant-process.enum";

export interface IListBatchesParamsEntity {
    mineId: string;
    typeOperationBatch: EPlantProcess;
}