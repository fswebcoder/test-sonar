import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IMineEntity } from "./mine.entity";

export interface IListMinesBySupplierResponseEntity extends IFlexibleApiResponse<IMineEntity, "list"> {}
