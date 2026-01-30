import { IApiResponse } from "@/shared/interfaces/api-response.interface";
import { IRoleEntity } from "./role.entity";

export interface IListRolesResponseEntity extends IApiResponse<IRoleEntity, true>{

}