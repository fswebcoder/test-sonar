import { IListBatchesParamsEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-params.entity";
import { IListBatchesResponseEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-response.entity";
import { ICreateSuppliersParamsEntity } from "@/domain/entities/admin/suppliers/create-suppliers-params.entity";
import { IFormFieldCreateSupplierEntity } from "@/domain/entities/admin/suppliers/form-field-create-supplier.entity";
import { ISuppliersEntity } from "@/domain/entities/admin/suppliers/suppliers.entity";
import { ICreateSupplierAdminUserParamsEntity } from "@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity";
import { SuppliersRepository } from "@/domain/repositories/admin/suppliers/suppliers.repository";
import { SuppliersDataSourceService } from "@/infrastructure/datasources/admin/suppliers/suppliers-data-source.service";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { inject, Injectable } from "@angular/core";
import { TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SuppliersRepositoryImpl extends SuppliersRepository{
    private readonly suppliersDataSourceService = inject(SuppliersDataSourceService);

    getAll(params?: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>> {
        return this.suppliersDataSourceService.getAll(params);
    }
    
    getFormFields(): Observable<IFlexibleApiResponse<IFormFieldCreateSupplierEntity[], 'single'>> {
        return this.suppliersDataSourceService.getFormFields();
    }

    create(params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersDataSourceService.create(params);
    }

    update(id: string, params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersDataSourceService.update(id, params);
    }

    getAllByFilter(params: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>> {
        return this.suppliersDataSourceService.getAllByFilter(params);
    }

    getById(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersDataSourceService.getById(id);
    }

    delete(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersDataSourceService.delete(id);
    }

    activate(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersDataSourceService.activate(id);
    }

    getBatches(params: IListBatchesParamsEntity): Observable<IListBatchesResponseEntity> {
        return this.suppliersDataSourceService.getBatches(params);
    }

    createSupplierAdminUser(params: ICreateSupplierAdminUserParamsEntity): Observable<IFlexibleApiResponse<any, 'single'>> {
        return this.suppliersDataSourceService.createSupplierAdminUser(params);
    }
}
