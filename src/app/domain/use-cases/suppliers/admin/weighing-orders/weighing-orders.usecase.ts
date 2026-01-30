import { ICreateWeighingOrderParams } from '@/domain/entities/suppliers/admin/weighing-orders/create-weighing-order-params.entity';
import { IListSupplierOrdersParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-params.entity';
import { IListSupplierOrdersResponseEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-response.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { WeighingOrdersRepository } from '@/domain/repositories/suppliers/admin/weighing-orders/weighing-orders.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeighingOrdersUsecase extends WeighingOrdersRepository {
  private readonly repo = inject(WeighingOrdersRepository);

  listSupplierOrders(params: IListSupplierOrdersParamsEntity): Observable<IListSupplierOrdersResponseEntity> {
    return this.repo.listSupplierOrders(params);
  }

  weightRegisterSupplier(params: ICreateWeighingOrderParams): Observable<IEmptyResponse> {
    return this.repo.weightRegisterSupplier(params);
  }

  cancelSupplierOrder(orderId: string): Observable<IEmptyResponse> {
    return this.repo.cancelSupplierOrder(orderId);
  }

  updateSupplierOrder(params: IUpdateSupplierOrderParamsEntity): Observable<IEmptyResponse> {
    return this.repo.updateSupplierOrder(params);
  }
}
