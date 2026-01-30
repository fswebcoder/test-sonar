export interface ISamplesReceptionParamsEntity {
  supplierId: string;
  observation: string;
  samples: ISamplesItems[];
}

export interface ISamplesItems {
  sampleTypeId: string;
  code: string;
  receivedWeight: number | null;
  moistureDetermination: boolean;
}
