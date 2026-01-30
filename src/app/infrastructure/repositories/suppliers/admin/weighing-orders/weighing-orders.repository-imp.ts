import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICreateWeighingOrderParams } from '@/domain/entities/suppliers/admin/weighing-orders/create-weighing-order-params.entity';
import { IListSupplierOrdersParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-params.entity';
import { IListSupplierOrdersResponseEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-response.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { WeighingOrdersRepository } from '@/domain/repositories/suppliers/admin/weighing-orders/weighing-orders.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { WeighingOrdersDatasourceService } from '@/infrastructure/datasources/suppliers/admin/weighing-orders/weighing-orders-datasource.service';

@Injectable({
  providedIn: 'root'
})
export class WeighingOrdersRepositoryImp extends WeighingOrdersRepository {
  private readonly datasource = inject(WeighingOrdersDatasourceService);

  listSupplierOrders(params: IListSupplierOrdersParamsEntity): Observable<IListSupplierOrdersResponseEntity> {
    return this.datasource.listSupplierOrders(params);
  }

  weightRegisterSupplier(params: ICreateWeighingOrderParams): Observable<IEmptyResponse> {
    return this.datasource.weightRegisterSupplier(params);
  }

  cancelSupplierOrder(orderId: string): Observable<IEmptyResponse> {
    return this.datasource.cancelSupplierOrder(orderId);
  }

  updateSupplierOrder(params: IUpdateSupplierOrderParamsEntity): Observable<IEmptyResponse> {
    return this.datasource.updateSupplierOrder(params);
  }
}
