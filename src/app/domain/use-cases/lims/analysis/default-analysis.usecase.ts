import { IDefaultAnalysisResponse } from "@/domain/entities/lims/analysis/default-analysis-response.entity";
import { DefaultAnalysisRepository } from "@/domain/repositories/lims/analysis/default-analysiss.repository";
import { IGetById } from "@/shared/interfaces/get-by-id.interface";
import { inject } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DefaultAnalysisUseCase implements IGetById<IDefaultAnalysisResponse[]>{
    private readonly defaultAnalysisRepository = inject(DefaultAnalysisRepository);

    getById(id: string): Observable<IGeneralResponse<IDefaultAnalysisResponse[]>> {
        return this.defaultAnalysisRepository.getById(id);
    }
}