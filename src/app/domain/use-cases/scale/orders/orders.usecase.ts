import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { OrdersRepository } from "@/domain/repositories/scale/orders/orders.repository";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { IListOrdersResponseEntity } from "@/domain/entities/scale/orders/list-orders-response.entity";
import { IOrdersQueryParams } from "@/domain/entities/scale/orders/orders-query-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IRegisterWeightParamsEntity } from "@/domain/entities/scale/orders/register-weight-params.entity";
import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";

@Injectable({
  providedIn: "root"
})
export class OrdersUsecase implements OrdersRepository {
  private readonly ordersRepository = inject(OrdersRepository);

  create(data: ICreateOrderParamsEntity): Observable<IEmptyResponse> {
    return this.ordersRepository.create(data);
  }

  getAll(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.ordersRepository.getAll(params);
  }

  getReceptions(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.ordersRepository.getReceptions(params);
  }

  getMovements(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.ordersRepository.getMovements(params);
  }

  registerMovementWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse> {
    return this.ordersRepository.registerMovementWeight(params);
  }

  registerReceptionWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse> {
    return this.ordersRepository.registerReceptionWeight(params);
  }

  asignBatchToOrder(params: IAsignBatchOrderParams): Observable<IEmptyResponse> {
    return this.ordersRepository.asignBatchToOrder(params);
  }

}
