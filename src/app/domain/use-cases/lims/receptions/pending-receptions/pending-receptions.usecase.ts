import { ICompletePendingReceptionParamsEntity } from "@/domain/entities/lims/receptions/pending-receptions/complete-pending-reception-params.entity";
import { IListPendingReceptionsResponseEntity } from "@/domain/entities/lims/receptions/pending-receptions/list-pending-receptions-response.entity";
import { PendingReceptionsRepository } from "@/domain/repositories/lims/receptions/pending-receptions/pending-receptions.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PendingReceptionsUsecase implements PendingReceptionsRepository {
    pendingReceptionsRepository: PendingReceptionsRepository = inject(PendingReceptionsRepository);

    getAll(): Observable<IListPendingReceptionsResponseEntity> {
        return this.pendingReceptionsRepository.getAll();
    }

    completePendingReception(params: ICompletePendingReceptionParamsEntity): Observable<IEmptyResponse> {
        return this.pendingReceptionsRepository.completePendingReception(params);
    }
}