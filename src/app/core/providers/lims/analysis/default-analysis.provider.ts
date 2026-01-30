import { DefaultAnalysisRepository } from "@/domain/repositories/lims/analysis/default-analysiss.repository";
import { DefaultAnalysisRepositoryImp } from "@/infrastructure/repositories/lims/analysis/default-analysis.repository-imp";
import { Provider } from "@angular/core";

export function defaultAnalysisProvider(): Provider[]{
    return [
        {
            provide: DefaultAnalysisRepository,
            useClass: DefaultAnalysisRepositoryImp
        }
    ]
}