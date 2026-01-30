import { IRepeateSampleParamsEntity } from '@/domain/entities/lims/receptions/samples/repeate-sample-params.entity';
import { ISampleReceptionResponseContent } from '@/domain/entities/lims/receptions/samples/sample-reception-response';
import { ISamplesReceptionParamsEntity } from '@/domain/entities/lims/receptions/samples/samples-reception-params';
import { ICreateData } from '@/shared/interfaces/create-data.interface';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

export abstract class SamplesRepository implements ICreateData<ISamplesReceptionParamsEntity, ISampleReceptionResponseContent> {
  abstract create(args: ISamplesReceptionParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>>;
  abstract repeatSample(args: IRepeateSampleParamsEntity): Observable<IGeneralResponse<ISampleReceptionResponseContent>>;
}
