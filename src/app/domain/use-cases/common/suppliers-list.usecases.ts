import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { SuppliersListRepository } from "@/domain/repositories/common/suppliers-list.repository";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SuppliersListUseCases implements IGetAll<IsupplierListResponseEntity, false> {
     private readonly suppliersListRepository = inject(SuppliersListRepository);

     getAll(): Observable<IGeneralResponse<IsupplierListResponseEntity[]>> {
        return this.suppliersListRepository.getAll();
     }
}