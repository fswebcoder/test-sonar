import { IGeneralResponse } from "@SV-Development/utilities";
import { IBigBagEntity } from "./big-bag.entity";

export interface IFillBigBagResponseEntity extends IGeneralResponse<Pick<IBigBagEntity, "consecutive">>{}