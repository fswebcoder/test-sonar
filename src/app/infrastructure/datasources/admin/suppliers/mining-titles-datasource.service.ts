import { BaseHttpService } from "@/core/providers/base-http.service";
import { IMiningTitlesResponseEntity } from "@/domain/entities/admin/suppliers/mining-titles-response.entity";
import { IMiningTitlesParamsEntity } from "@/domain/entities/admin/suppliers/minint-titles-params.entity";
import { MiningTitlesRepository } from "@/domain/repositories/admin/suppliers/mining-titles.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class MiningTitlesDatasourceService extends BaseHttpService<MiningTitlesRepository> implements MiningTitlesRepository {

    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}suppliers/`;

    getAll(params?: IMiningTitlesParamsEntity): Observable<IMiningTitlesResponseEntity> {
        return this.get<IMiningTitlesResponseEntity>(`mining-titles/${params?.id}`);
    }

}