import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

import { ICreateWeighingOrderParams } from '@/domain/entities/suppliers/admin/weighing-orders/create-weighing-order-params.entity';
import { IListSupplierOrdersParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-params.entity';
import { IListSupplierOrdersResponseEntity } from '@/domain/entities/suppliers/admin/weighing-orders/list-supplier-orders-response.entity';
import { IUpdateSupplierOrderParamsEntity } from '@/domain/entities/suppliers/admin/weighing-orders/update-supplier-order-params.entity';
import { WeighingOrdersRepository } from '@/domain/repositories/suppliers/admin/weighing-orders/weighing-orders.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { buildHttpParams } from '@/core/utils/build-http-params';

@Injectable({
  providedIn: 'root'
})
export class WeighingOrdersDatasourceService extends WeighingOrdersRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  private readonly apiUrlBase = `${this.env.services.security}`;

  listSupplierOrders(params: IListSupplierOrdersParamsEntity): Observable<IListSupplierOrdersResponseEntity> {
    const httpParams = buildHttpParams(params);
    return this.http.get<IListSupplierOrdersResponseEntity>(`${this.apiUrlBase}weight-register-supplier`, { params: httpParams });
  }

  weightRegisterSupplier(params: ICreateWeighingOrderParams): Observable<IEmptyResponse> {
    const formData = new FormData();
    
    formData.append('vehicleId', params.vehicleId);
    formData.append('driverId', params.driverId);
    formData.append('materialTypeId', params.materialTypeId);
    formData.append('sendedWeight', params.sendedWeight.toString());
    formData.append('estimatedShippingDateTime', params.estimatedShippingDateTime.toISOString());
    
    if (params.mineId) {
      formData.append('mineId', params.mineId);
    }
    if (params.supplierBatchName) {
      formData.append('supplierBatchName', params.supplierBatchName);
    }
    if (params.veedorId) {
      formData.append('veedorId', params.veedorId);
    }
    if (params.internalRemissionDocument) {
      formData.append('internalRemissionDocument', params.internalRemissionDocument);
    }

    return this.http.post<IEmptyResponse>(`${this.apiUrlBase}weight-register-supplier`, formData);
  }

  cancelSupplierOrder(orderId: string): Observable<IEmptyResponse> {
    return this.http.delete<IEmptyResponse>(`${this.apiUrlBase}weight-register-supplier/${orderId}`);
  }

  updateSupplierOrder(params: IUpdateSupplierOrderParamsEntity): Observable<IEmptyResponse> {
    const formData = new FormData();
    
    if (params.vehicleId) {
      formData.append('vehicleId', params.vehicleId);
    }
    if (params.driverId) {
      formData.append('driverId', params.driverId);
    }
    if (params.materialTypeId) {
      formData.append('materialTypeId', params.materialTypeId);
    }
    if (params.sendedWeight !== undefined) {
      formData.append('sendedWeight', params.sendedWeight.toString());
    }
    if (params.estimatedShippingDateTime) {
      formData.append('estimatedShippingDateTime', params.estimatedShippingDateTime.toISOString());
    }
    if (params.mineId) {
      formData.append('mineId', params.mineId);
    }
    if (params.supplierBatchName !== undefined) {
      formData.append('supplierBatchName', params.supplierBatchName ?? '');
    }
    if (params.veedorId) {
      formData.append('veedorId', params.veedorId);
    }
    if (params.internalRemissionDocument) {
      formData.append('internalRemissionDocument', params.internalRemissionDocument);
    }

    return this.http.patch<IEmptyResponse>(`${this.apiUrlBase}weight-register-supplier/${params.id}`, formData);
  }
}
