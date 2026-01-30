import { SampleScaleRepository } from "@/domain/repositories/lims/sample-scale/sample-scale.repository";
import { SampleScaleRepositoryImp } from "@/infrastructure/repositories/lims/sample-scale/sample-scale.repository-imp";
import { Provider } from "@angular/core";

export function sampleScaleProvider(): Provider[] {
    return [
        {
            provide: SampleScaleRepository,
            useExisting: SampleScaleRepositoryImp
        }
    ];
}