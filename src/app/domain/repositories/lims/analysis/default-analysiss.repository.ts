import { IDefaultAnalysisResponse } from "@/domain/entities/lims/analysis/default-analysis-response.entity";
import { IGetById } from "@/shared/interfaces/get-by-id.interface";
import { Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class DefaultAnalysisRepository implements IGetById<IDefaultAnalysisResponse[]>{
    abstract getById(id: string): Observable<IGeneralResponse<IDefaultAnalysisResponse[]>>;
}