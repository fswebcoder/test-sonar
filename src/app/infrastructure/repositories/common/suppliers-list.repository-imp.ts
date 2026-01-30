import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { SuppliersListRepository } from "@/domain/repositories/common/suppliers-list.repository";
import { SuppliersListDatasourceService } from "@/infrastructure/datasources/common/suppliers-list.datasource.service";
import { Injectable, inject } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class SuppliersListRepositoryImp implements SuppliersListRepository {
    private readonly suppliersListDatasourceService = inject(SuppliersListDatasourceService);

    getAll(): Observable<IGeneralResponse<IsupplierListResponseEntity[]>> {
        return this.suppliersListDatasourceService.getAll();
    }
  }