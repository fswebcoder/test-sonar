import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IMaterialTypeEntity } from "./material-type.entity";

export interface IListMaterialTypesResponseEntity extends IFlexibleApiResponse<IMaterialTypeEntity, "paginated">{}