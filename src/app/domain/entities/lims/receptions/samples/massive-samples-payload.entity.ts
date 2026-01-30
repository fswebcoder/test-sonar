import { IMassiveSamplesBasePayload } from './massive-samples-base-payload.entity';

export interface IMassiveSamplesPayload extends IMassiveSamplesBasePayload {
  moistureDetermination: boolean;
}
