import { IMiningTitlesResponseEntity } from "@/domain/entities/admin/suppliers/mining-titles-response.entity";
import { IMiningTitlesParamsEntity } from "@/domain/entities/admin/suppliers/minint-titles-params.entity";
import { MiningTitlesRepository } from "@/domain/repositories/admin/suppliers/mining-titles.repository";
import { MiningTitlesDatasourceService } from "@/infrastructure/datasources/admin/suppliers/mining-titles-datasource.service";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MiningTitlesRepositoryImp extends MiningTitlesRepository {
    private miningTitlesDatasourceService = inject(MiningTitlesDatasourceService);

    override getAll(params?: IMiningTitlesParamsEntity): Observable<IMiningTitlesResponseEntity> {
        return this.miningTitlesDatasourceService.getAll(params);
    }
}