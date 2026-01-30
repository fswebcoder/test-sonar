import { Provider } from "@angular/core";

import { MinesAdminRepository } from "@/domain/repositories/suppliers/admin/mines/mines-admin.repository";
import { MinesAdminRepositoryImp } from "@/infrastructure/repositories/suppliers/admin/mines/mines-admin.repository-imp";

export function minesAdminProvider(): Provider[] {
  return [
    {
      provide: MinesAdminRepository,
      useClass: MinesAdminRepositoryImp
    }
  ];
}
