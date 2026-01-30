import { makeEnvironmentProviders } from '@angular/core';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideStore } from './provide.store';

export function provideCore() {
  return makeEnvironmentProviders([provideEnvironmentNgxMask(), provideStore()]);
}
