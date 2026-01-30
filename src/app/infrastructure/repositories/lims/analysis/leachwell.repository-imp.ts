import { ILeachwellCompleteParamsEntity, ILeachwellParamsEntity } from "@/domain/entities/lims/analysis/leachwell/leachwell-params.entity";
import { ILeachwellResponseEntity } from "@/domain/entities/lims/analysis/leachwell/leachwell-response-entity";
import { LeachwellRepository } from "@/domain/repositories/lims/analysis/leachwell.repository";
import { LeachwellService } from "@/infrastructure/datasources/lims/analysis/leachwell-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Injectable } from "@angular/core";
import { IGeneralResponse, PaginatedData, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LeachwellRepositoryImp extends LeachwellRepository {
    constructor(private readonly leachwellService: LeachwellService) {
        super();
    }

    create(params: ILeachwellParamsEntity): Observable<IGeneralResponse<ILeachwellResponseEntity>> {
        return this.leachwellService.create(params);
    }

    getAll(params?: TPaginationParams): Observable<IGeneralResponse<PaginatedData<ILeachwellResponseEntity>>> {
        return this.leachwellService.getAll(params);
    }

    complete(params: ILeachwellCompleteParamsEntity): Observable<IEmptyResponse> {
        return this.leachwellService.complete(params);
    }
}