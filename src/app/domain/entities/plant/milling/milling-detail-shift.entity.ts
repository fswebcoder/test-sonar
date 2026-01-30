import { IIdName } from "@/shared/interfaces/id-name.interface";
import { IMillingDetailEntity } from "./milling-detail.entity";

export interface IMillingShiftInfoEntity extends IIdName {
	startDate: string;
	endDate: string;
}

export interface IMillingShiftDetailEntity extends IMillingDetailEntity {}

export type IMillingDetailShiftEntity = IMillingShiftInfoEntity | IMillingShiftDetailEntity;