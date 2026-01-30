import { IGeneralResponse } from "@SV-Development/utilities";

export interface IXrfResponseEntity extends IGeneralResponse<IErrorsXrfResponseEntity> {
  }

export interface IErrorsXrfResponseEntity {
    repeatedSampleCodes: string[];
    samplesWithNoQuarteringAnalysis: string[];
    samplesWithXRFAnalysis: string[];
  }