
import { MoistureDeterminationRepository } from '@/domain/repositories/lims/analysis/moisture-determination.repository';
import { MoistureDeterminationRepositoryImp } from '@/infrastructure/repositories/lims/analysis/moisture-absorption.repository-imp';
import { Provider } from '@angular/core';

export function moistureDeterminationProvider(): Provider[] {
  return [  
    {
      provide: MoistureDeterminationRepository,
      useClass: MoistureDeterminationRepositoryImp
    }
  ];
}
