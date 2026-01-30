import { UsersRepository } from "@/domain/repositories/admin/users/users.repository";
import { UsersDatasourceService } from "@/infrastructure/datasources/admin/users/users-datasource.service";
import { ICreateUsersParamsEntity } from "@/domain/entities/admin/users/create-users-params.entity";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TPaginationParams } from "@SV-Development/utilities";
import { IUserEntity } from "@/domain/entities/admin/users/user.entity";
import { IUpdateUsersParamsEntity } from "@/domain/entities/admin/users/update-users-params.entity";

@Injectable({
    providedIn: 'root'
})
export class UsersRepositoryImp implements UsersRepository{
    private readonly usersDatasourceService = inject(UsersDatasourceService);

    create(params: ICreateUsersParamsEntity): Observable<IFlexibleApiResponse<IEmptyResponse, 'single'>> {
        return this.usersDatasourceService.create(params);
    }

    getAll(params: TPaginationParams): Observable<IFlexibleApiResponse<IUserEntity, 'paginated'>> {
        return this.usersDatasourceService.getAll(params);
    }
    update(params: IUpdateUsersParamsEntity): Observable<IEmptyResponse> {
        return this.usersDatasourceService.update(params);
    }

    changeUserStatus(userId: string): Observable<IEmptyResponse> {
        return this.usersDatasourceService.changeUserStatus(userId);
    }

    activateUser(userId: string): Observable<IEmptyResponse> {
        return this.usersDatasourceService.activateUser(userId);
    }

    deactivateUser(userId: string): Observable<IEmptyResponse> {
        return this.usersDatasourceService.deactivateUser(userId);
    }
}