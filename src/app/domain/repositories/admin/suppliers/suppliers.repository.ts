import { IListBatchesParamsEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-params.entity";
import { IListBatchesResponseEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-response.entity";
import { ICreateSupplierAdminUserParamsEntity } from "@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity";
import { ICreateSuppliersParamsEntity } from "@/domain/entities/admin/suppliers/create-suppliers-params.entity";
import { IFormFieldCreateSupplierEntity } from "@/domain/entities/admin/suppliers/form-field-create-supplier.entity";
import { ISuppliersEntity } from "@/domain/entities/admin/suppliers/suppliers.entity";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export abstract class SuppliersRepository implements IGetAll<ISuppliersEntity, true>, ICreateData<ICreateSuppliersParamsEntity, ISuppliersEntity> {
    abstract getAll(params?: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>>;
    abstract getFormFields(): Observable<IFlexibleApiResponse<IFormFieldCreateSupplierEntity[], 'single'>>;
    abstract create(params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>>;
    abstract update(id: string, params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>>;
    abstract getAllByFilter(params: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>>;
    abstract getById(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>>;
    abstract delete(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>>;
    abstract activate(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>>;
    abstract getBatches(params: IListBatchesParamsEntity): Observable<IListBatchesResponseEntity>;
    abstract createSupplierAdminUser(params: ICreateSupplierAdminUserParamsEntity): Observable<IFlexibleApiResponse<any, 'single'>>;
}