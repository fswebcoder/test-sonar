import { RolesDatasourceService } from "@/infrastructure/datasources/admin/roles/roles-datasource.service";
import { RolesRepository } from "@/domain/repositories/admin/roles/roles.repository";
import { inject, Injectable } from "@angular/core";
import { IListRolesParamsEntity } from "@/domain/entities/admin/roles/list-roles-params.entity";
import { IListRolesResponseEntity } from "@/domain/entities/admin/roles/list-roles-response.entity";
import { Observable } from "rxjs";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { ICreateRolesParamsEntity } from "@/domain/entities/admin/roles/create-roles-params.entity";
import { IRoleDetailResponseEntity } from "@/domain/entities/admin/roles/role-detail-response.entity";
import { IUpdateRoleParamsEntity } from "@/domain/entities/admin/roles/update-role-params.entity";

@Injectable({
    providedIn: 'root'
})
export class RolesRepositoryImp implements RolesRepository {
    private rolesDatasourceService = inject(RolesDatasourceService);

    getAll(params: IListRolesParamsEntity): Observable<IListRolesResponseEntity> {
        return this.rolesDatasourceService.getAll(params);
    }

    create(data: ICreateRolesParamsEntity): Observable<IEmptyResponse> {
        return this.rolesDatasourceService.create(data);
    }

    getDetail(id: string): Observable<IRoleDetailResponseEntity> {
        return this.rolesDatasourceService.getDetail(id);
    }

    update(id: string, data: IUpdateRoleParamsEntity): Observable<IEmptyResponse> {
        return this.rolesDatasourceService.update(id, data);
    }

    deleteRole(id: string): Observable<IEmptyResponse> {
        return this.rolesDatasourceService.deleteRole(id);
    }

    activateRole(id: string): Observable<IEmptyResponse> {
        return this.rolesDatasourceService.activateRole(id);
    }
}
