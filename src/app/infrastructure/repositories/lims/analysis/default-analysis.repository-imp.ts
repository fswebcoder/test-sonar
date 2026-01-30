import { DefaultAnalysisDatasource } from "@/infrastructure/datasources/lims/analysis/default-analysis-datasource.service";
import { DefaultAnalysisRepository } from "@/domain/repositories/lims/analysis/default-analysiss.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";
import { IDefaultAnalysisResponse } from "@/domain/entities/lims/analysis/default-analysis-response.entity";

@Injectable({
    providedIn: 'root'
})
export class DefaultAnalysisRepositoryImp implements DefaultAnalysisRepository {
    private readonly defaultAnalysisDatasource = inject(DefaultAnalysisDatasource);

    getById(id: string): Observable<IGeneralResponse<IDefaultAnalysisResponse[]>> {
        return this.defaultAnalysisDatasource.getById(id);
    }
}