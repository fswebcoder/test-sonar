import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";

export interface IGetById<T> {
    getById(id: string): Observable<IGeneralResponse<T>>;
}

