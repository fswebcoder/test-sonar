import { IRequiredAnalysis } from "../laboratory/laboratory-receptions-params.entity";
import { ISamplesItems, ISamplesReceptionParamsEntity } from "../samples/samples-reception-params";

export interface ICreateSampleSendingParamsEntity extends Pick<ISamplesReceptionParamsEntity, "supplierId" | "observation"> {
    samples: ISendingSampleItemEntity[]
}

export interface  ISendingSampleItemEntity extends Pick<ISamplesItems, "code" | "sampleTypeId" | "moistureDetermination"> {
    requiredAnalyses: IRequiredAnalysis[]
}
