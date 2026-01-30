import { BaseHttpService } from "@/core/providers/base-http.service";
import { IActionsResponseEntity } from "@/domain/entities/common/actions-response.entity";
import { ActionsRepository } from "@/domain/repositories/common/actions.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class ActionsDatasourceService extends BaseHttpService<IActionsResponseEntity> implements ActionsRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}action/`;

    getAll(): Observable<IActionsResponseEntity> {
        return this.get<IActionsResponseEntity>(``);
    }

}