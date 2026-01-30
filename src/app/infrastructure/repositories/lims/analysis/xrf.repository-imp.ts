import { IXrfParamsEntity } from "@/domain/entities/lims/analysis/xrf/xrf-params.entity";
import { IXrfResponseEntity } from "@/domain/entities/lims/analysis/xrf/xrf-response";
import { XrfRepository } from "@/domain/repositories/lims/analysis/xrf.repository";
import { XrfDatasourceService } from "@/infrastructure/datasources/lims/analysis/xrf-datasource.service";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class XrfRepositoryImp extends XrfRepository {
    xrfRepositoryService = inject(XrfDatasourceService);

    create(params: IXrfParamsEntity): Observable<IXrfResponseEntity> {
        return this.xrfRepositoryService.create(params);
    }
}