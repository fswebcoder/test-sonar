import { IGeneralResponse } from "@SV-Development/utilities";
import { IPendingReceptionEntity } from "./pending-reception.entity";

export interface IListPendingReceptionsResponseEntity extends IGeneralResponse<IPendingReceptionEntity[]> {}