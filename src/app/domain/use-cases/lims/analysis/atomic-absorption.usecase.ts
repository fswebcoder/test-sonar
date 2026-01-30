import { IAtomicAbsorptionParamsEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-params.entity';
import { IAtomicAbsorptionResponseEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-response.entity';
import { AtomicAbsorptionRepository } from '@/domain/repositories/lims/analysis/atomic-absorption.repository';

import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IGeneralResponse } from '@SV-Development/utilities';

@Injectable({
  providedIn: 'root'
})
export class AtomicAbsorptionUseCase implements AtomicAbsorptionRepository {
  private readonly atomicAbsorptionRepository = inject(AtomicAbsorptionRepository);
  create(args: IAtomicAbsorptionParamsEntity): Observable<IGeneralResponse<IAtomicAbsorptionResponseEntity>> {
    return this.atomicAbsorptionRepository.create(args);
  }
}
