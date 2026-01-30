import { IGeneralResponse, PaginatedData } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export interface IGetAll<T, IsPaginated extends boolean = false> {
    getAll(params?: any): Observable<IGeneralResponse<IsPaginated extends true ? PaginatedData<T> : T[]>>;
}

