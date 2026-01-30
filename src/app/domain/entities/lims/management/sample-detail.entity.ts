import { IQuarteringEntity } from "./quartering.entity";
import ISampleDetailRequiredAnalysesEntity from "./sample-detail-required-analyses.entity";
import { ISampleEntity } from "./sample.entity";
 
export default interface ISampleDetailEntity extends Pick<ISampleEntity, 'sampleId' | 'receivedWeight' | 'sampleTypeName' | 'supplierName'> {
  statusName: string;
  quartering: IQuarteringEntity[];
  code: string;
  receptionDate: string;
  requiredAnalyses: ISampleDetailRequiredAnalysesEntity[];
}
