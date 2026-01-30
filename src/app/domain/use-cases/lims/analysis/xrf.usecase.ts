import { IXrfParamsEntity } from "@/domain/entities/lims/analysis/xrf/xrf-params.entity";
import { IXrfResponseEntity } from "@/domain/entities/lims/analysis/xrf/xrf-response";
import { XrfRepository } from "@/domain/repositories/lims/analysis/xrf.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class XrfUseCase implements XrfRepository {
    private readonly xrfRepository = inject(XrfRepository);

    create(params: IXrfParamsEntity): Observable<IXrfResponseEntity> {
        return this.xrfRepository.create(params);
    }
}