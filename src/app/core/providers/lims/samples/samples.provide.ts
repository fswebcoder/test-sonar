import { SamplesRepository } from '@/domain/repositories/lims/samples/samples.repository';
import { SamplesReceptionRepository } from '@/infrastructure/repositories/lims/samples/samples-reception.repository-imp';
import { Provider } from '@angular/core';

export function limsProvide(): Provider[] {
  return [
    {
      provide: SamplesRepository,
      useClass: SamplesReceptionRepository
    }
  ];
}
