import { ISampleEntity } from "../../management/sample.entity";

export interface IFireTestParamsEntity extends Pick<ISampleEntity, "sampleId">{
    analysisDate: string;
    regularWeight?: number;
    doreWeight?: number;
}