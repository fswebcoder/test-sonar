import { DoreRepository } from "@/domain/repositories/lims/management/dore.repositry";
import { DoreRepositoryImp } from "@/infrastructure/repositories/lims/management/dore.repository-imp";
import { Provider } from "@angular/core";

export function provideDore(): Provider[] {
    return [
        { provide: DoreRepository, useClass: DoreRepositoryImp },
    ]
}