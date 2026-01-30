import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISupplierContactEntity } from "./supplier-contact.entity";

export interface IGetSupplierContactResponseEntity extends IFlexibleApiResponse<ISupplierContactEntity, "single"> {}
