import { OvenProcess } from './oven-process.enum';

export interface IOvenCreateCopelacionParamsEntity {
    ovenId: string;
    process: OvenProcess.COPELACION;
} 