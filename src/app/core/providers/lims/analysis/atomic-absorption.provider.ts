
import { AtomicAbsorptionRepository } from '@/domain/repositories/lims/analysis/atomic-absorption.repository';

import { AtomicAbsorptionRepositoryImpl } from '@/infrastructure/repositories/lims/analysis/atomic-absorption.repository-imp';
import { Provider } from '@angular/core';

export function atomicAbsorptionProvider(): Provider[] {
  return [
    {
      provide: AtomicAbsorptionRepository,
      useClass: AtomicAbsorptionRepositoryImpl
    }
  ];
}
