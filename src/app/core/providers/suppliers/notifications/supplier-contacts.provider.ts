import { Provider } from "@angular/core";

import { SupplierContactsRepository } from "@/domain/repositories/suppliers/notifications/supplier-contacts.repository";
import { SupplierContactsRepositoryImp } from "@/infrastructure/repositories/suppliers/notifications/supplier-contacts.repository-imp";

export function supplierContactsProvider(): Provider[] {
  return [
    {
      provide: SupplierContactsRepository,
      useClass: SupplierContactsRepositoryImp
    }
  ];
}
