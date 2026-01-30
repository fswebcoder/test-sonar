import { GenericAnalysisParamsType } from '@/shared/types/generic-params.type';

export interface IRetallaParamsEntity extends Pick<GenericAnalysisParamsType<unknown>, 'sampleCode'> {
  retainedWeight: number;
  passWeight: number;
}
