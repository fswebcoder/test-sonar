import { BaseHttpService } from "@/core/providers/base-http.service";
import { IDoreDropdownEntity } from "@/domain/entities/lims/management/dore-dropdown-entity";
import { IDoreDropdownParamsEntity } from "@/domain/entities/lims/management/dore-dropdown.params.entity";
import { IDoreListResponseEntity } from "@/domain/entities/lims/management/dore-list.response";
import { IDoreParamsEntity } from "@/domain/entities/lims/management/dore-params.entity";
import { DoreRepository } from "@/domain/repositories/lims/management/dore.repositry";
import { HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class IDoreDatasourceService extends BaseHttpService<IDoreListResponseEntity> implements DoreRepository{
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}dore-management/`;

    getAll(params?: IDoreParamsEntity): Observable<IGeneralResponse<PaginatedData<IDoreListResponseEntity>>> {
        return this.get<IGeneralResponse<PaginatedData<IDoreListResponseEntity>>>(`find-by-filters`, { params: params as unknown as HttpParams });
    }

    getDropdown(params?: IDoreDropdownParamsEntity): Observable<IGeneralResponse<IDoreDropdownEntity>> {
        return this.get<IGeneralResponse<IDoreDropdownEntity>>(`dropdown-data`, { params: params as unknown as HttpParams });
    }
}