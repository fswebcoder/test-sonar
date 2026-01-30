import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import IBatchEntity from "./batch.entity";

export interface IListBatchesResponseEntity extends IFlexibleApiResponse<IBatchEntity, "list">{}