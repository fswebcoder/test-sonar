import { ISamplesItems } from "../samples/samples-reception-params";

export interface ICompletePendingReceptionParamsEntity extends Pick<ISamplesItems, "receivedWeight">{

    sampleCode: string;

}