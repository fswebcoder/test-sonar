import { GenericAnalysisParamsType } from '@/shared/types/generic-params.type';

export interface ILeachwellParamsEntity extends Pick<GenericAnalysisParamsType<unknown>, 'sampleCode'> {
  duration: number;
}

export interface ILeachwellCompleteParamsEntity {
  id: string;
}
