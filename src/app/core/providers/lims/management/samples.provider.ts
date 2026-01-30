import { SamplesRepositoryImp } from "@/infrastructure/repositories/lims/management/samples.repository-imp";
import { SamplesRepository } from "@/domain/repositories/lims/management/samples.repository";
import { SamplesDropdownRepository } from "@/domain/repositories/lims/management/samples-dropdown.repository";
import { SamplesDropdownRepositoryImp } from "@/infrastructure/repositories/lims/management/samples-dropdown.repository.imp";

export function samplesProvider(){
    return [
        {
            provide: SamplesRepository,
            useClass: SamplesRepositoryImp,
        },
        {
            provide: SamplesDropdownRepository,
            useClass: SamplesDropdownRepositoryImp,
        }
    ]
}