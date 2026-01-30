import { ICreateRolesParamsEntity } from "@/domain/entities/admin/roles/create-roles-params.entity";
import { IListRolesParamsEntity } from "@/domain/entities/admin/roles/list-roles-params.entity";
import { IListRolesResponseEntity } from "@/domain/entities/admin/roles/list-roles-response.entity";
import { IRoleDetailResponseEntity } from "@/domain/entities/admin/roles/role-detail-response.entity";
import { IRoleEntity } from "@/domain/entities/admin/roles/role.entity";
import { IUpdateRoleParamsEntity } from "@/domain/entities/admin/roles/update-role-params.entity";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class RolesRepository implements IGetAll<IRoleEntity, true>, ICreateData<ICreateRolesParamsEntity, null>{
    abstract getAll(params?: IListRolesParamsEntity): Observable<IListRolesResponseEntity>;
    abstract create(data: ICreateRolesParamsEntity): Observable<IEmptyResponse>;
    abstract getDetail(id: string): Observable<IRoleDetailResponseEntity>;
    abstract update(id: string, data: IUpdateRoleParamsEntity): Observable<IEmptyResponse>;
    abstract deleteRole(id: string): Observable<IEmptyResponse>;
    abstract activateRole(id: string): Observable<IEmptyResponse>;
}


