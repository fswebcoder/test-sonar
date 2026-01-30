import { BigBagsRepository } from "@/domain/repositories/plant/drying/big-bags.repository";
import { BigBagsRepositoryImp } from "@/infrastructure/repositories/plant/drying/big-bags.repository-imp";
import { Provider } from "@angular/core";

export default function bigBagsProvider(): Provider[] {
    return [
        {
            provide: BigBagsRepository,
            useClass: BigBagsRepositoryImp
        }
    ];
}