export interface IAddPersonnelParamsEntity {
  personnelId: string;
  positionId: string;
  operationAreaId: string;
}

export interface IAddPersonnelShiftConfigParamsEntity extends IAddPersonnelParamsEntity {
  startDateConfig: string;
  endDateConfig: string;
  shiftConfigId: string;
}
