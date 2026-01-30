import { IGeneralResponse } from "./general-response";
import { PaginatedData } from "./paginated-data";

export type IpaginatedResponse<T> = IGeneralResponse<PaginatedData<T>>;
