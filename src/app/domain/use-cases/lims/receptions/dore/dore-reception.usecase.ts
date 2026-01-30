import { IDoreReceptionParamsEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-params.entity";
import { IDoreReceptionResponseEntity } from "@/domain/entities/lims/receptions/dore/dore-reception-response.entity";
import { DoreReceptionRepository } from "@/domain/repositories/lims/receptions/dore/dore-reception.repository";
import { DoreReceptionsRepositoryImp } from "@/infrastructure/repositories/lims/receptions/dore-receptions.repository-imp";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DoreReceptionUseCase implements DoreReceptionRepository{
    private readonly doreReceptionRepository = inject(DoreReceptionsRepositoryImp);
    create(params: IDoreReceptionParamsEntity): Observable<IDoreReceptionResponseEntity> {
        return this.doreReceptionRepository.create(params);
    }
}