import { SampleStatus } from '@/shared/enums/sample-status.enum';
import { IAnalysisEntity } from '../analysis/analysis.entity';
import { IRequiredAnalysisEntity } from '../analysis/required-analysis.entity';

export interface ISampleEntity {
  supplierName: string;
  sampleId: string;
  sampleCode: string;
  receivedWeight: string;
  receptionDate: string;
  sampleTypeName: string;
  status: SampleStatus;
  sampleTypeShortName: string;
  requiredAnalyses: IRequiredAnalysisEntity[];
  analyses: IAnalysisEntity<{
    label: string;
    value: boolean;
  }>[];
}
