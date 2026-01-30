import { BaseHttpService } from "@/core/providers/base-http.service";
import { inject, Injectable } from "@angular/core";
import { DoreReceptionRepository } from "@/domain/repositories/lims/receptions/dore/dore-reception.repository";
import { ENVIRONMENT } from "src/app.config";
import { IDoreReceptionResponseEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-response.entity";
import { IDoreReceptionParamsEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-params.entity";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DoreReceptionsDatasourceService extends BaseHttpService<null> implements DoreReceptionRepository {
    private readonly env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}dore-receptions/`;

    create(params: IDoreReceptionParamsEntity): Observable<IDoreReceptionResponseEntity> {
        return this.post<IDoreReceptionResponseEntity>(params, '');
    }
}