import { IRetallaParamsEntity } from "@/domain/entities/lims/analysis/retalla/retalla-params.entity";
import { RetallaRepository } from "@/domain/repositories/lims/analysis/retalla.repository";
import { RetallaDatasourceService } from "@/infrastructure/datasources/lims/analysis/retalla-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RetallaRepositoryImp implements RetallaRepository {
    private retallaDatasourceService = inject(RetallaDatasourceService);

    create(params: IRetallaParamsEntity): Observable<IEmptyResponse> {
        return this.retallaDatasourceService.create(params);
    }
}