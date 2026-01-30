import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IDriverEntity } from "./driver.entity";

export interface IListDriversResponseEntity extends IFlexibleApiResponse<IDriverEntity, "paginated">{}