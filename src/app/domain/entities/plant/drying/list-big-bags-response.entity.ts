import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IBigBagEntity } from "./big-bag.entity";

export interface IListBigBagsResponseEntity extends IFlexibleApiResponse<IBigBagEntity, "paginated">{}