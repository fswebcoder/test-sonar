import { IApiResponse } from "@/shared/interfaces/api-response.interface";
import { IActionEntity } from "./action.entity";

export interface IActionsResponseEntity extends IApiResponse<IActionEntity, false> { 

}