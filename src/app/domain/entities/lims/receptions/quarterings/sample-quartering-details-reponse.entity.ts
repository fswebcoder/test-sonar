import ISampleDetailEntity from "@/domain/entities/lims/management/sample-detail.entity";

export interface ISampleQuarteringDetailsResponseEntity
  extends Pick<ISampleDetailEntity, 'sampleId' | 'code' | 'receivedWeight' | 'quartering'> {
  requiredAnalyses: IRequiredAnalysisQuarteringEntity[];
}

export interface IRequiredAnalysisQuarteringEntity {
  requiredAnalysisId: string;
  targetAnalysisId: string;
  analysisName: string;
  analysisShortName: string;
  replicatedIndex: number
}
