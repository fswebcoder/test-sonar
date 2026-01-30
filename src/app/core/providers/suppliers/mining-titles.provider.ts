import { MiningTitlesRepository } from "@/domain/repositories/admin/suppliers/mining-titles.repository";
import { MiningTitlesRepositoryImp } from "@/infrastructure/repositories/admin/suppliers/mining-titles.repository-imp";

export function miningTitlesProvider(){
    return [
        {
            provide: MiningTitlesRepository,
            useClass: MiningTitlesRepositoryImp
        }
    ]
}