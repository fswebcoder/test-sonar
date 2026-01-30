import { IApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISampleTypeEntity } from "./sample-type.entity";

export interface IListSampleTypesResponseEntity extends IApiResponse<ISampleTypeEntity, true>{}