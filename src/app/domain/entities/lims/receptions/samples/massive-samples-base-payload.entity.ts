export interface IMassiveSamplesBasePayload {
  sampleTypeId: string;
  prefix: string;
  rangeStart: number;
  rangeEnd: number;
  moistureDetermination?: boolean;
}
