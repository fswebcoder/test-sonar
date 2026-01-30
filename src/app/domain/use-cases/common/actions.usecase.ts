import { IActionsResponseEntity } from "@/domain/entities/common/actions-response.entity";
import { ActionsRepository } from "@/domain/repositories/common/actions.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ActionsUseCase implements ActionsRepository{
    private readonly actionsRepository: ActionsRepository = inject(ActionsRepository);

    getAll(): Observable<IActionsResponseEntity> {
        return this.actionsRepository.getAll();
    }
}