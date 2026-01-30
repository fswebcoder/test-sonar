import { ISampleTypeEntity } from "./sample-type.entity";

export interface ICreateSampleTypeParams extends Pick<ISampleTypeEntity, "name" | "shortName" | "autoGenerateCode" | "description">{

}