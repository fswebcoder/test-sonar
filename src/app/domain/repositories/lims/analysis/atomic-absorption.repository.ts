import { IAtomicAbsorptionParamsEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-params.entity';
import { IAtomicAbsorptionResponseEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-response.entity';

import { Observable } from 'rxjs';

import { IGeneralResponse } from '@SV-Development/utilities';
import { ICreateData } from '@/shared/interfaces/create-data.interface';

export abstract class AtomicAbsorptionRepository implements ICreateData<IAtomicAbsorptionParamsEntity, IAtomicAbsorptionResponseEntity> {
  abstract create(
    args: IAtomicAbsorptionParamsEntity
  ): Observable<IGeneralResponse<IAtomicAbsorptionResponseEntity>>;
}
