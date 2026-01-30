export interface IAnalysisEntity<T> {
  analysisName: string;
  analysisShortName: string;
  analysisDate: Date;
  resultValue: T;
}
