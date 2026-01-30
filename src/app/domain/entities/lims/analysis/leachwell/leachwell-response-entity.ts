export interface ILeachwellResponseEntity {
  id: string;
  sampleId: string;
  analysisDate: string;
  targetFinishDate: string;
  done: boolean;
  sample: {
    id: string;
    code: string;
  };
  duration: number;
}
