import { Provider } from "@angular/core";
import { LaboratoryReceptionRepository } from "@/domain/repositories/lims/receptions/laboratory/laboratory-receptions-repository";
import { LaboratoryReceptionsRepositoryImp } from "@/infrastructure/repositories/lims/receptions/laboratory-receptions.respository-imp";

export function laboratoryReceptionProvider() : Provider[] {
    return [
        {
            provide: LaboratoryReceptionRepository,
            useClass: LaboratoryReceptionsRepositoryImp
        }
    ]
}