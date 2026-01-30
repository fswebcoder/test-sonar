export interface IFinishCupellationParams {
  fireAssayId: string;
  samples: ISampleDoreWeight[];
}

interface ISampleDoreWeight {
  sampleId: string;
  doreWeight: number;
}
