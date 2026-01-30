import { ISuppliersEntity } from "@/domain/entities/admin/suppliers/suppliers.entity";
import { SuppliersRepository } from "@/domain/repositories/admin/suppliers/suppliers.repository";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TPaginationParams } from "@SV-Development/utilities";
import { IFormFieldCreateSupplierEntity } from "@/domain/entities/admin/suppliers/form-field-create-supplier.entity";
import { ICreateSuppliersParamsEntity } from "@/domain/entities/admin/suppliers/create-suppliers-params.entity";
import { IListBatchesParamsEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-params.entity";
import { IListBatchesResponseEntity } from "@/domain/entities/admin/suppliers/batches/list-batches-response.entity";
import { ICreateSupplierAdminUserParamsEntity } from "@/domain/entities/admin/suppliers/create-supplier-admin-user-params.entity";
@Injectable({
    providedIn: 'root'
})
export class SuppliersUseCase extends SuppliersRepository{
    private readonly suppliersRepository = inject(SuppliersRepository);

    getAll(params?: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>> {
        return this.suppliersRepository.getAll(params);
    }

    getFormFields(): Observable<IFlexibleApiResponse<IFormFieldCreateSupplierEntity[], 'single'>> {
        const data = this.suppliersRepository.getFormFields();
        return data;
    }

    create(params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersRepository.create(params);
    }

    update(id: string, params: ICreateSuppliersParamsEntity): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersRepository.update(id, params);
    }

    getAllByFilter(params: TPaginationParams): Observable<IFlexibleApiResponse<ISuppliersEntity, 'paginated'>> {
        return this.suppliersRepository.getAllByFilter(params);
    }

    getById(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersRepository.getById(id);
    }   

    delete(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersRepository.delete(id);
    }

    activate(id: string): Observable<IFlexibleApiResponse<ISuppliersEntity, 'single'>> {
        return this.suppliersRepository.activate(id);
    }

    getBatches(params: IListBatchesParamsEntity): Observable<IListBatchesResponseEntity> {
        return this.suppliersRepository.getBatches(params);
    }

    createSupplierAdminUser(params: ICreateSupplierAdminUserParamsEntity): Observable<IFlexibleApiResponse<any, 'single'>> {
        return this.suppliersRepository.createSupplierAdminUser(params);
    }

}