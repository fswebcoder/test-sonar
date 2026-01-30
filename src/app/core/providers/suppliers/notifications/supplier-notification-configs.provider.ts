import { Provider } from "@angular/core";

import { SupplierNotificationConfigsRepository } from "@/domain/repositories/suppliers/notifications/supplier-notification-configs.repository";
import { SupplierNotificationConfigsRepositoryImp } from "@/infrastructure/repositories/suppliers/notifications/supplier-notification-configs.repository-imp";

export function supplierNotificationConfigsProvider(): Provider[] {
  return [
    {
      provide: SupplierNotificationConfigsRepository,
      useClass: SupplierNotificationConfigsRepositoryImp
    }
  ];
}
