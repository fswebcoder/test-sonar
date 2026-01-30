import { IMillingDetailEntity } from "./milling-detail.entity";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";

export interface IGetMillingDetailResponseEntity extends IFlexibleApiResponse<IMillingDetailEntity, "list">{}