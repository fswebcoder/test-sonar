import { ISampleEntity } from "@/domain/entities/lims/management/sample.entity";

export interface ISampleReceptionResponseContent extends Pick<ISampleEntity, "sampleId" | "sampleCode">{
}