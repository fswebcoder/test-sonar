import { IMiningTitlesResponseEntity } from "@/domain/entities/admin/suppliers/mining-titles-response.entity";
import { IMiningTitlesParamsEntity } from "@/domain/entities/admin/suppliers/minint-titles-params.entity";
import { MiningTitlesRepository } from "@/domain/repositories/admin/suppliers/mining-titles.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MiningTitlesUseCase extends MiningTitlesRepository {

    private readonly miningTitlesRepository = inject(MiningTitlesRepository);

    getAll(params?: IMiningTitlesParamsEntity): Observable<IMiningTitlesResponseEntity> {
        return this.miningTitlesRepository.getAll(params);
    }
}

