import { ICompletePendingReceptionParamsEntity } from "@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity";
import { IListPendingReceptionsResponseEntity } from "@/domain/entities/lims/receptions/pending-receptions/list-pending-receptions-response.entity";
import { PendingReceptionsRepository } from "@/domain/repositories/lims/receptions/pending-receptions/pending-receptions.repository";
import { PendingReceptionsDatasourceService } from "@/infrastructure/datasources/lims/receptions/pending-receptions-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PendingReceptionsRepositoryImp implements PendingReceptionsRepository{
    pendingReceptionsDatasourceService: PendingReceptionsDatasourceService = inject(PendingReceptionsDatasourceService);
   
    getAll(): Observable<IListPendingReceptionsResponseEntity> {
        return this.pendingReceptionsDatasourceService.getAll();
    }

    completePendingReception(params: ICompletePendingReceptionParamsEntity): Observable<IEmptyResponse> {
        return this.pendingReceptionsDatasourceService.completePendingReception(params);
    }
    
}