import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { IListOrdersResponseEntity } from "@/domain/entities/scale/orders/list-orders-response.entity";
import { IOrderEntity } from "@/domain/entities/scale/orders/order.entity";
import { IOrdersQueryParams } from "@/domain/entities/scale/orders/orders-query-params.entity";
import { IRegisterWeightParamsEntity } from "@/domain/entities/scale/orders/register-weight-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Observable } from "rxjs";

type OrdersGetAllContract = IGetAll<IOrderEntity, true>;

type OrdersCreateContract = ICreateData<ICreateOrderParamsEntity, null>;

export abstract class OrdersRepository implements OrdersCreateContract, OrdersGetAllContract {
    abstract create(data: ICreateOrderParamsEntity): Observable<IEmptyResponse>;
    abstract getAll(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity>;
    abstract getReceptions(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity>;
    abstract getMovements(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity>;
    abstract registerMovementWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse>;
    abstract registerReceptionWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse>;
    abstract asignBatchToOrder(params: IAsignBatchOrderParams): Observable<IEmptyResponse>;

}
