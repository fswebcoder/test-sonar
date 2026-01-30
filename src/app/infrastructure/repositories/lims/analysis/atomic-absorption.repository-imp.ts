import { IAtomicAbsorptionParamsEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-params.entity';
import { IAtomicAbsorptionResponseEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-response.entity';
import { AtomicAbsorptionRepository } from '@/domain/repositories/lims/analysis/atomic-absorption.repository';

import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { AtomicAbsorptionService } from '@/infrastructure/datasources/lims/analysis/atomic-absorption-datasource.service';

import { IGeneralResponse } from '@SV-Development/utilities';

export class AtomicAbsorptionRepositoryImpl implements AtomicAbsorptionRepository {
  private atomicAbsorptionService = inject(AtomicAbsorptionService);

  create(args: IAtomicAbsorptionParamsEntity): Observable<IGeneralResponse<IAtomicAbsorptionResponseEntity>> {
    return this.atomicAbsorptionService.create(args);
  }
}
