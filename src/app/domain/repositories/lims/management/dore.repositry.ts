import { IDoreDropdownEntity } from "@/domain/entities/lims/management/dore-dropdown-entity";
import { IDoreDropdownParamsEntity } from "@/domain/entities/lims/management/dore-dropdown.params.entity";
import { IDoreListResponseEntity } from "@/domain/entities/lims/management/dore-list.response";
import { IDoreParamsEntity } from "@/domain/entities/lims/management/dore-params.entity";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class DoreRepository implements IGetAll<IDoreListResponseEntity, true>{
    abstract getAll(params?: IDoreParamsEntity): Observable<IGeneralResponse<PaginatedData<IDoreListResponseEntity>>>;

    abstract getDropdown(params?: IDoreDropdownParamsEntity): Observable<IGeneralResponse<IDoreDropdownEntity>>;
}