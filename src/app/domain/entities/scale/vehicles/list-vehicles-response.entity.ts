import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IVehicle } from "./vehicle.entity";

export interface IListVehiclesResponse extends IFlexibleApiResponse<IVehicle, "paginated"> {}