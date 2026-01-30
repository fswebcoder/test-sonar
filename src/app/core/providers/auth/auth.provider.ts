import { LoginRepository } from '@/domain/repositories/auth/auth.repository';
import { LoginRepositoryImpl } from '@/infrastructure/repositories/auth/auth.repository-imp';
import { Provider } from '@angular/core';

export function authProvider(): Provider[] {
  return [
    {
      provide: LoginRepository,
      useClass: LoginRepositoryImpl
    }
  ];
}
