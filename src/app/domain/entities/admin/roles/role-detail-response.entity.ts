import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IRoleDetailEntity } from "./role-detail.entity";

export interface IRoleDetailResponseEntity extends IFlexibleApiResponse<IRoleDetailEntity, 'single'> {

}