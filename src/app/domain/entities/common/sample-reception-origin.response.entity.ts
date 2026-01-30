import { ISampleTypeEntity } from "../lims/sample-types/sample-type.entity";

export interface ISampleType extends Omit<ISampleTypeEntity, "isActive"> {
}
