import { IOvenEFEntity } from "./oven-ef.entity";

export interface IOvenCreateEFParamsEntity extends Omit<IOvenEFEntity, "status" | "process">{
}