export default interface IPersonnelEntity {
  personnelShiftId: string;
  name: string;
  lastName: string;
  position: string;
}

export interface IPersonnelShiftConfigEntity extends Omit<IPersonnelEntity, "personnelShiftId"> {
  configuredPersonnelShiftId: string;
  startDateConfig: string;
  endDateConfig: string;
}