import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ISupplierContactEntity } from "./supplier-contact.entity";

export interface IListSupplierContactsResponseEntity extends IFlexibleApiResponse<ISupplierContactEntity, "list"> {}
