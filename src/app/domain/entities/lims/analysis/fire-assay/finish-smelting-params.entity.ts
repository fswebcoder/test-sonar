export interface IFinishSmeltingParams {
  fireAssayId: string;
  samples: ISampleRegulusWeight[];
}

interface ISampleRegulusWeight {
  sampleId: string;
  regulusWeight: number;
}