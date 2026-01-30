import { IQuarteringItemEntity } from './quartering-items.entity';

export interface IQuarteringParamsEntity {
  sampleCode: string;
  quartering: IQuarteringItemEntity[];
}
