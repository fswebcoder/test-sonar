import { IOvenEFEntity } from "./oven-ef.entity";

export interface IOvenEFCompleteFoundryParamsEntity extends Pick<IOvenEFEntity, "status" | "traceId"> {}