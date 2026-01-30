export interface IDeleteShiftPersonnelConfigParamsEntity{
  id: string;
}

export interface IDeleteShiftPersonnelParamsEntity extends IDeleteShiftPersonnelConfigParamsEntity{
  observation: string;
}