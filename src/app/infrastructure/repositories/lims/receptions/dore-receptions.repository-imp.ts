import { IDoreReceptionParamsEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-params.entity";
import { IDoreReceptionResponseEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-response.entity";
import { DoreReceptionRepository } from "@/domain/repositories/lims/receptions/dore/dore-reception.repository";
import { DoreReceptionsDatasourceService } from "@/infrastructure/datasources/lims/receptions/dore-receptions-datasource.service";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DoreReceptionsRepositoryImp implements DoreReceptionRepository {
    private readonly doreReceptionsDatasourceService = inject(DoreReceptionsDatasourceService);

    create(params: IDoreReceptionParamsEntity): Observable<IDoreReceptionResponseEntity> {
        return this.doreReceptionsDatasourceService.create(params);
    }
}