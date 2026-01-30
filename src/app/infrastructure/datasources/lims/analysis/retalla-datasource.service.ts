import { BaseHttpService } from "@/core/providers/base-http.service";
import { IRetallaParamsEntity } from "@/domain/entities/lims/analysis/retalla/retalla-params.entity";
import { RetallaRepository } from "@/domain/repositories/lims/analysis/retalla.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class RetallaDatasourceService extends BaseHttpService<IEmptyResponse> implements RetallaRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}analysis/`;

    create(params: IRetallaParamsEntity): Observable<IEmptyResponse> {
        return this.post<IEmptyResponse>(params, 'rt');
    }
}