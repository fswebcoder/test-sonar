import { IActionsResponseEntity } from "@/domain/entities/common/actions-response.entity";
import { ActionsRepository } from "@/domain/repositories/common/actions.repository";
import { ActionsDatasourceService } from "@/infrastructure/datasources/common/actions.datasource.service";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ActionsRepositoryImp implements ActionsRepository {
    private readonly actionsDatasourceService: ActionsDatasourceService = inject(ActionsDatasourceService);

    getAll(): Observable<IActionsResponseEntity> {
        return this.actionsDatasourceService.getAll();
    }
}