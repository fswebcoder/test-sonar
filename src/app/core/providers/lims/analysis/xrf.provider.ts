import { Provider } from "@angular/core";
import { XrfRepository } from "@/domain/repositories/lims/analysis/xrf.repository";
import { XrfRepositoryImp } from "@/infrastructure/repositories/lims/analysis/xrf.repository-imp";


export function xrfProvider(): Provider[] {
    return [
        {
            provide: XrfRepository,
            useClass: XrfRepositoryImp
        }
    ]
}