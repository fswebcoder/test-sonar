import IPersonnelEntity, { IPersonnelShiftConfigEntity } from "./personnel.entity";

export default interface IShiftEntity {
  shiftDescription: IShiftDescription;
  areasOfOperation: IAreasOfOperation[];
}


export interface IShiftDescription {
  shiftId: string;
  name: string;
  startDate: string;
  endDate: string;
  createdBy: string;
}

export interface IAreasOfOperation {
  operationAreaId: string;
  name: string;
  personnel: IPersonnelEntity[]
}

export interface IAreasOfOperationConfig {
  operationAreaId: string;
  name: string;
  personnel: IPersonnelShiftConfigEntity[];
}