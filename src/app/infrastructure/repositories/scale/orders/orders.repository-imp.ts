import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OrdersRepository } from "@/domain/repositories/scale/orders/orders.repository";
import { OrdersDatasourceService } from "@/infrastructure/datasources/scale/orders/orders-datasource.service";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { IListOrdersResponseEntity } from "@/domain/entities/scale/orders/list-orders-response.entity";
import { IOrdersQueryParams } from "@/domain/entities/scale/orders/orders-query-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IRegisterWeightParamsEntity } from "@/domain/entities/scale/orders/register-weight-params.entity";
import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";

@Injectable({
  providedIn: "root"
})
export class OrdersRepositoryImp extends OrdersRepository {
  private readonly ordersDatasource = inject(OrdersDatasourceService);

  create(data: ICreateOrderParamsEntity): Observable<IEmptyResponse> {
    return this.ordersDatasource.create(data);
  }

  getAll(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.ordersDatasource.getAll(params);
  }

  getMovements(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.ordersDatasource.getMovements(params);
  }

  getReceptions(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.ordersDatasource.getReceptions(params);
  }

  registerMovementWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse> {
    return this.ordersDatasource.registerMovementWeight(params);
  }

  registerReceptionWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse> {
    return this.ordersDatasource.registerReceptionWeight(params);
  }

  asignBatchToOrder(params: IAsignBatchOrderParams): Observable<IEmptyResponse> {
    return this.ordersDatasource.asignBatchToOrder(params);
  }
}
