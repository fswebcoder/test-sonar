import { ISampleEntity } from '../../management/sample.entity';
import { ISamplesItems } from './samples-reception-params';

export interface IRepeateSampleParamsEntity
  extends Pick<ISamplesItems, 'moistureDetermination' | 'receivedWeight'>,
    Pick<ISampleEntity, 'sampleId'> {}
