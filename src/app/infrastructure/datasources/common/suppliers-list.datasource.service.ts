import { BaseHttpService } from "@/core/providers/base-http.service";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { SuppliersListRepository } from "@/domain/repositories/common/suppliers-list.repository";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
  })
  export class SuppliersListDatasourceService extends BaseHttpService<IsupplierListResponseEntity[]> implements SuppliersListRepository {

    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}common/catalogs/`;

    getAll(): Observable<IGeneralResponse<IsupplierListResponseEntity[]>> {
        return this.get<IGeneralResponse<IsupplierListResponseEntity[]>>(`SUPPLIERS`);
    }

  }