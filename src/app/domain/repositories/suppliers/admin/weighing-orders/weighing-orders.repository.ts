import { ICreateWeighingOrderParams } from '@/domain/entities/suppliers/admin/weighing-orders/create-weighing-order-params.entity';
import { IListSupplierOrdersParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-params.entity';
import { IListSupplierOrdersResponseEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-response.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { Observable } from 'rxjs';

export abstract class WeighingOrdersRepository {
  abstract weightRegisterSupplier(params: ICreateWeighingOrderParams): Observable<IEmptyResponse>;
  abstract listSupplierOrders(params: IListSupplierOrdersParamsEntity): Observable<IListSupplierOrdersResponseEntity>;
  abstract cancelSupplierOrder(orderId: string): Observable<IEmptyResponse>;
  abstract updateSupplierOrder(params: IUpdateSupplierOrderParamsEntity): Observable<IEmptyResponse>;
}
