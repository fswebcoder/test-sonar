import { ICreateUsersParamsEntity } from "@/domain/entities/admin/users/create-users-params.entity";
import { IUserEntity } from "@/domain/entities/admin/users/user.entity";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { Observable } from "rxjs";
import { ICreateData } from "@/shared/interfaces/create-data.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Injectable } from "@angular/core";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { TPaginationParams } from "@SV-Development/utilities";
import { IUpdateUsersParamsEntity } from "@/domain/entities/admin/users/update-users-params.entity";

@Injectable({
    providedIn: 'root'
})
export abstract class UsersRepository implements IGetAll<IUserEntity, true>, ICreateData<ICreateUsersParamsEntity, IEmptyResponse> {
    abstract getAll(params: TPaginationParams): Observable<IFlexibleApiResponse<IUserEntity, 'paginated'>>;
    abstract create(params: ICreateUsersParamsEntity): Observable<IFlexibleApiResponse<IEmptyResponse, 'single'>>;
    abstract update(params: IUpdateUsersParamsEntity): Observable<IEmptyResponse>;
    abstract changeUserStatus(userId: string): Observable<IEmptyResponse>;

    abstract activateUser(userId: string): Observable<IEmptyResponse>;
    abstract deactivateUser(userId: string): Observable<IEmptyResponse>;
}