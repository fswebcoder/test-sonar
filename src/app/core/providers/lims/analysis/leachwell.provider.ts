import { LeachwellRepository } from "@/domain/repositories/lims/analysis/leachwell.repository";
import { LeachwellRepositoryImp } from "@/infrastructure/repositories/lims/analysis/leachwell.repository-imp";
import { Provider } from "@angular/core";

export function leachwellProvider(): Provider[] {
    return [
        {
            provide: LeachwellRepository,
            useClass: LeachwellRepositoryImp
        }
    ]
}