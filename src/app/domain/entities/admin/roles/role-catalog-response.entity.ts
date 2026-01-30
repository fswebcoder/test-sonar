import { IRoleCatalogEntity } from "./role-catalog.entity";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";

export interface IRoleCatalogResponseEntity extends IFlexibleApiResponse<IRoleCatalogEntity[], "list"> {
}