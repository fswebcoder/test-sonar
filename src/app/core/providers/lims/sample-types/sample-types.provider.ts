import { SampleTypeRepository } from "@/domain/repositories/lims/sample-types/sample-types.repository";
import { SampleTypeRepositoryImp } from "@/infrastructure/repositories/lims/sample-types/sample-types.repository-imp";
import { Provider } from "@angular/core";

export function sampleTypeProvider(): Provider[] {
    return [
        {
            provide: SampleTypeRepository,
            useClass: SampleTypeRepositoryImp
        }
    ]
}