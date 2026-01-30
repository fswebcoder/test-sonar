import { IDoreReceptionParamsEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class DoreReceptionRepository implements ICreateData<IDoreReceptionParamsEntity, null> {
    abstract create(params: IDoreReceptionParamsEntity): Observable<IGeneralResponse<null>>;
}