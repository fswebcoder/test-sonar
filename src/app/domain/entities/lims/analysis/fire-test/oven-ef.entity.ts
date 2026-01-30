import { OvenProcess } from './oven-process.enum';
import { OvenStatus } from './oven-status.enum';

export interface IOvenEFEntity {
    ovenId: string;
    column: number;
    row: number;
    sampleIds: (string | null)[];
    process: OvenProcess;
    status: OvenStatus;
    traceId?: string;
    createdAt?: string;
}
