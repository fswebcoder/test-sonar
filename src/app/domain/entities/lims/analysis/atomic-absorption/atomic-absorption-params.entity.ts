import { GenericAnalysisParamsType } from "@/shared/types/generic-params.type";

export interface IAtomicAbsorptionParamsEntity extends Omit<GenericAnalysisParamsType<{}>, "resultValue"> {}