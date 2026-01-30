import { OvenRepository } from "@/domain/repositories/lims/analysis/oven.repository";
import { OvenRepositoryImp } from "@/infrastructure/repositories/lims/analysis/oven.repository-imp";
import { Provider } from "@angular/core";

export function ovenProvider(): Provider[]{
    return [
        {
            provide: OvenRepository,
            useClass: OvenRepositoryImp
        }
    ]
}