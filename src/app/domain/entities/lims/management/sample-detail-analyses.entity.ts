import { IAnalysisEntity } from "../analysis/analysis.entity";
import ISampleDetailResultValueEntity from "./sample-detail-result-value.entity";

export default interface ISampleDetailAnalysesEntity extends Pick<IAnalysisEntity<ISampleDetailResultValueEntity[]>,'analysisName' | 'analysisShortName' | 'resultValue'> {
  
}