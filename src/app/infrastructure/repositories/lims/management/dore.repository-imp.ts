import { IDoreDropdownEntity } from "@/domain/entities/lims/management/dore-dropdown-entity";
import { IDoreDropdownParamsEntity } from "@/domain/entities/lims/management/dore-dropdown.params.entity";
import { IDoreListResponseEntity } from "@/domain/entities/lims/management/dore-list.response";
import { IDoreParamsEntity } from "@/domain/entities/lims/management/dore-params.entity";
import { DoreRepository } from "@/domain/repositories/lims/management/dore.repositry";
import { IDoreDatasourceService } from "@/infrastructure/datasources/lims/management/dore-datasorce.service";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DoreRepositoryImp implements DoreRepository {
    private readonly doreDatasource = inject(IDoreDatasourceService);

    getAll(params?: IDoreParamsEntity): Observable<IGeneralResponse<PaginatedData<IDoreListResponseEntity>>> {
        return this.doreDatasource.getAll(params);
    }

    getDropdown(params?: IDoreDropdownParamsEntity): Observable<IGeneralResponse<IDoreDropdownEntity>> {
        return this.doreDatasource.getDropdown(params);
    }
}