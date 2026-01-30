import { IListRolesParamsEntity } from "@/domain/entities/admin/roles/list-roles-params.entity";
import { IListRolesResponseEntity } from "@/domain/entities/admin/roles/list-roles-response.entity";
import { RolesRepository } from "@/domain/repositories/admin/roles/roles.repository";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { Injectable } from "@angular/core";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { ICreateRolesParamsEntity } from "@/domain/entities/admin/roles/create-roles-params.entity";
import { IRoleDetailResponseEntity } from "@/domain/entities/admin/roles/role-detail-response.entity";
import { IUpdateRoleParamsEntity } from "@/domain/entities/admin/roles/update-role-params.entity";

@Injectable({
    providedIn: 'root'
})
export class RolesUseCase implements RolesRepository {
    private rolesRepository = inject(RolesRepository);

    getAll(params?: IListRolesParamsEntity): Observable<IListRolesResponseEntity> {
        return this.rolesRepository.getAll(params);
    }

    create(data: ICreateRolesParamsEntity): Observable<IEmptyResponse> {
        return this.rolesRepository.create(data);
    }

    getDetail(id: string): Observable<IRoleDetailResponseEntity> {
        return this.rolesRepository.getDetail(id);
    }

    update(id: string, data: IUpdateRoleParamsEntity): Observable<IEmptyResponse> {
        return this.rolesRepository.update(id, data);
    }

    deleteRole(id: string): Observable<IEmptyResponse> {
        return this.rolesRepository.deleteRole(id);
    }

    activateRole(id: string): Observable<IEmptyResponse> {
        return this.rolesRepository.activateRole(id);
    }
}