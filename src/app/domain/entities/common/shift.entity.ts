import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IShiftConfigEntity extends IIdName{
  startDate:string;
  endDate:string;
}