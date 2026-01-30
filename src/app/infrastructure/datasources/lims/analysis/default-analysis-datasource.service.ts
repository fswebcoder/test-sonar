import { BaseHttpService } from "@/core/providers/base-http.service";
import { IDefaultAnalysisResponse } from "@/domain/entities/lims/analysis/default-analysis-response.entity";
import { DefaultAnalysisRepository } from "@/domain/repositories/lims/analysis/default-analysiss.repository";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class DefaultAnalysisDatasource extends BaseHttpService<IDefaultAnalysisResponse> implements DefaultAnalysisRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}reception-origins/`;

    getById(id: string): Observable<IGeneralResponse<IDefaultAnalysisResponse[]>> {
        return this.get<IGeneralResponse<IDefaultAnalysisResponse[]>>(`default-analysis/${id}`);
    }
}