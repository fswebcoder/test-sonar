import { ISampleEntity } from "../../management/sample.entity";

export default interface IFireAssayDetail extends Pick<ISampleEntity, "sampleId" | "sampleCode">{
  row: number;
  column: number;
  regulusWeight: number;
}