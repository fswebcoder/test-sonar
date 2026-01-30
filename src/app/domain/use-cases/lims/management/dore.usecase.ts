import { IDoreParamsEntity } from "@/domain/entities/lims/management/dore-params.entity";
import { IDoreListResponseEntity } from "@/domain/entities/lims/management/dore-list.response";
import { DoreRepository } from "@/domain/repositories/lims/management/dore.repositry";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDoreDropdownParamsEntity } from "@/domain/entities/lims/management/dore-dropdown.params.entity";
import { IDoreDropdownEntity } from "@/domain/entities/lims/management/dore-dropdown-entity";
import { IGeneralResponse, PaginatedData } from "@SV-Development/utilities";

@Injectable({
    providedIn: 'root'
})
export class IDoreUseCase implements DoreRepository {
    private readonly doreRepository = inject(DoreRepository);

    getAll(params?: IDoreParamsEntity): Observable<IGeneralResponse<PaginatedData<IDoreListResponseEntity>>> {
        return this.doreRepository.getAll(params);
    }

    getDropdown(params?: IDoreDropdownParamsEntity): Observable<IGeneralResponse<IDoreDropdownEntity>> {
        return this.doreRepository.getDropdown(params);
    }
}