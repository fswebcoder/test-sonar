import { Provider } from "@angular/core";
import { OrdersRepository } from "@/domain/repositories/scale/orders/orders.repository";
import { OrdersRepositoryImp } from "@/infrastructure/repositories/scale/orders/orders.repository-imp";

export default function ordersProvider(): Provider[] {
  return [
    {
      provide: OrdersRepository,
      useClass: OrdersRepositoryImp
    }
  ];
}
