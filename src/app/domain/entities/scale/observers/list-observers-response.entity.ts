import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IObserverEntity } from "./observer.entity";

export interface IListObserversResponseEntity extends IFlexibleApiResponse<IObserverEntity, "paginated"> {}
