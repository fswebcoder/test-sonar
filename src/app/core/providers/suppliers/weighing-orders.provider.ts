import { Provider } from '@angular/core';

import { WeighingOrdersRepository } from '@/domain/repositories/suppliers/admin/weighing-orders/weighing-orders.repository';
import { WeighingOrdersRepositoryImp } from '@/infrastructure/repositories/suppliers/admin/weighing-orders/weighing-orders.repository-imp';

export default function weighingOrdersProvider(): Provider[] {
  return [
    {
      provide: WeighingOrdersRepository,
      useClass: WeighingOrdersRepositoryImp
    }
  ];
}
