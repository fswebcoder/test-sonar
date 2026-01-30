export interface IQuarteringEntity {
  id: string;
  analysisShortName: string;
  done: boolean;
  weight: number;
  replicatedIndex: number | undefined
}
