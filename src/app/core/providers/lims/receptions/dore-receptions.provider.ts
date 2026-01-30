import { DoreReceptionsRepositoryImp } from "@/infrastructure/repositories/lims/receptions/dore-receptions.repository-imp";
import { DoreReceptionRepository } from "@/domain/repositories/lims/receptions/dore/dore-reception.repository";
import {  Provider } from "@angular/core";

export function provideDoreReceptions(): Provider[] {
    return [
        {
            provide: DoreReceptionRepository,
            useClass: DoreReceptionsRepositoryImp
        }
    ]
}