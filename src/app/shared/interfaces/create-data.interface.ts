import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

export interface ICreateData<TParams, TResponse> {
    create(data: TParams): Observable<IGeneralResponse<TResponse>>;
}