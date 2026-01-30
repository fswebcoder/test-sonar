import { OvenStatus } from './oven-status.enum';

export interface IOvenUpdateEFParamsEntity {
    sampleIds: string[];
    status: OvenStatus;
    traceId?: string;
}