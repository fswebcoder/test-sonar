import { RetallaRepository } from "@/domain/repositories/lims/analysis/retalla.repository";
import { RetallaRepositoryImp } from "@/infrastructure/repositories/lims/analysis/retalla.repository-imp";
import { Provider } from "@angular/core";

export function retallaProvider(): Provider[] {
    return [
        {
            provide: RetallaRepository,
            useClass: RetallaRepositoryImp
        }
    ]
}