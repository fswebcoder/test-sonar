import { ICreateSuppliersParamsEntity } from "@/domain/entities/admin/suppliers/create-suppliers-params.entity";
import { IFormFieldCreateSupplierEntity } from "@/domain/entities/admin/suppliers/form-field-create-supplier.entity";
import { ISuppliersEntity } from "@/domain/entities/admin/suppliers/suppliers.entity";
import { SuppliersRepository } from "@/domain/repositories/admin/suppliers/suppliers.repository";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT } from "src/app.config";
import { Observable } from "rxjs";
import { TPaginationParams } from "@SV-Development/utilities";
import { IListBatchesParamsEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-params.entity";
import { IListBatchesResponseEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-response.entity";
import { ICreateSupplierAdminUserParamsEntity } from "@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity";

@Injectable({
  providedIn: 'root'
})
export class SuppliersDataSourceService extends SuppliersRepository {

  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  apiUrlBase = `${this.env.services.security}suppliers/`;

  getAll(params?: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>> {
    return this.http.get<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>>(`${this.apiUrlBase}`, { params: buildHttpParams(params) });
  }

  getFormFields(): Observable<IFlexibleApiResponse<IFormFieldCreateSupplierEntity[], 'single'>> {
    return this.http.get<IFlexibleApiResponse<IFormFieldCreateSupplierEntity[], 'single'>>(`${this.apiUrlBase}dynamic_supplier_properties/form-schema`);
  }

  create(params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
    return this.http.post<IFlexibleApiResponse<ISuppliersEntity, 'single'>>(`${this.apiUrlBase}`, params);
  }

  update(id: string, params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
    return this.http.patch<IFlexibleApiResponse<ISuppliersEntity, 'single'>>(`${this.apiUrlBase}${id}`, params);
  }

  getAllByFilter(params: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>> {
    return this.http.get<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>>(`${this.apiUrlBase}`, { params: buildHttpParams(params) });
  }

  getById(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
    return this.http.get<IFlexibleApiResponse<ISuppliersEntity, 'single'>>(`${this.apiUrlBase}findByParams/${id}`);
  }

  delete(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
    return this.http.delete<IFlexibleApiResponse<ISuppliersEntity, 'single'>>(`${this.apiUrlBase}delete/${id}`);
  }

  activate(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
    return this.http.patch<IFlexibleApiResponse<ISuppliersEntity, 'single'>>(`${this.apiUrlBase}activate/${id}`, {});
  }

  getBatches(params: IListBatchesParamsEntity): Observable<IListBatchesResponseEntity> {
    return this.http.get<IListBatchesResponseEntity>(`${this.apiUrlBase}batches/${params.mineId}/${params.typeOperationBatch}`);
  }

  createSupplierAdminUser(params: ICreateSupplierAdminUserParamsEntity): Observable<IFlexibleApiResponse<any, 'single'>> {
    return this.http.post<IFlexibleApiResponse<any, 'single'>>(`${this.apiUrlBase}user`, params);
  }

}

