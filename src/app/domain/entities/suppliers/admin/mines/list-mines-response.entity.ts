import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IMineEntity } from "./mine.entity";

export interface IListMinesResponseEntity extends IFlexibleApiResponse<IMineEntity, "paginated"> {}
