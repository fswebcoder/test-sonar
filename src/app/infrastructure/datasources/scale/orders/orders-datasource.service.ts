import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { OrdersRepository } from "@/domain/repositories/scale/orders/orders.repository";
import { ICreateOrderParamsEntity } from "@/domain/entities/scale/orders/create-order-params.entity";
import { IListOrdersResponseEntity } from "@/domain/entities/scale/orders/list-orders-response.entity";
import { IOrdersQueryParams } from "@/domain/entities/scale/orders/orders-query-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { ENVIRONMENT } from "src/app.config";
import { IRegisterWeightParamsEntity } from "@/domain/entities/scale/orders/register-weight-params.entity";
import { IAsignBatchOrderParams } from "@/domain/entities/scale/orders/asign-batch-order-params.entity";

@Injectable({
  providedIn: "root"
})
export class OrdersDatasourceService extends BaseHttpService<undefined> implements OrdersRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}weight-register/`;

  create(data: ICreateOrderParamsEntity): Observable<IEmptyResponse> {
    const formData = this.buildFormData(data);
    return this.post<IEmptyResponse>(formData, "");
  }

  private buildFormData(data: ICreateOrderParamsEntity): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (key === "internalRemissionDocument") {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
          formData.append(key, value[0], value[0].name);
        }
        return;
      }

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
        return;
      }

      formData.append(key, String(value));
    });

    return formData;
  }

  getAll(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.get<IListOrdersResponseEntity>("list-all-weight", { params: buildHttpParams(params) });
  }

  getReceptions(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.get<IListOrdersResponseEntity>("receptions", { params: buildHttpParams(params) });
  }

  getMovements(params: IOrdersQueryParams): Observable<IListOrdersResponseEntity> {
    return this.get<IListOrdersResponseEntity>("movements", { params: buildHttpParams(params) });
  }

  registerReceptionWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(params, "register-reception-weight");
  }
  registerMovementWeight(params: IRegisterWeightParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(params, "register-movement-weight");
  }

  asignBatchToOrder(params: IAsignBatchOrderParams): Observable<IEmptyResponse> {
    const { orderId, ...rest } = params;
    return this.patch<IEmptyResponse>(rest, "assign-batch/" + orderId);
  }
}
