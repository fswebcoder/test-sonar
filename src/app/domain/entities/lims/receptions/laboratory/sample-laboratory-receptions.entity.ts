import { IRequiredAnalysis } from '@/domain/entities/lims/receptions/laboratory/laboratory-receptions-params.entity';

export default interface ISampleLaboratoryReceptionsResponse {
  sampleCode: string;
  receivedWeight: number;
  sampleTypeName: string;
  hasRequiredAnalysis: boolean;
  defaultAnalyses: IRequiredAnalysis[];
}
