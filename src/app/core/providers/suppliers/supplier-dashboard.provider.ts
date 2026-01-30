import { Provider } from '@angular/core';

import { SupplierDashboardRepository } from '@/domain/repositories/suppliers/admin/dashboard/supplier-dashboard.repository';
import { SupplierDashboardRepositoryImp } from '@/infrastructure/repositories/suppliers/admin/dashboard/supplier-dashboard.repository-imp';

export default function supplierDashboardProvider(): Provider[] {
  return [
    {
      provide: SupplierDashboardRepository,
      useClass: SupplierDashboardRepositoryImp
    }
  ];
}
