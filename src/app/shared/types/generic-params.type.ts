export type GenericAnalysisParamsType<T> = {
  sampleId: string;
  analysisDate: string;
  file: File;
  resultValue: T;
  sampleCode?: string;
};
