import { ICreateUsersParamsEntity } from "@/domain/entities/admin/users/create-users-params.entity";
import { UsersRepository } from "@/domain/repositories/admin/users/users.repository";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { TPaginationParams } from "@SV-Development/utilities";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { IUserEntity } from "@/domain/entities/admin/users/user.entity";
import { Injectable } from "@angular/core";
import { IUpdateUsersParamsEntity } from "@/domain/entities/admin/users/update-users-params.entity";

@Injectable({
    providedIn: 'root'
})
export class UsersUseCase implements UsersRepository{
    private readonly usersRepository = inject(UsersRepository);

    create(params:ICreateUsersParamsEntity): Observable<IFlexibleApiResponse<IEmptyResponse, 'single'>> {
        return this.usersRepository.create(params);
    }

    getAll(params: TPaginationParams): Observable<IFlexibleApiResponse<IUserEntity, 'paginated'>> {
        return this.usersRepository.getAll(params);
    }

    update(params: IUpdateUsersParamsEntity): Observable<IEmptyResponse> {
        return this.usersRepository.update(params);
    }

    changeUserStatus(userId: string): Observable<IEmptyResponse> {
        return this.usersRepository.changeUserStatus(userId);
    }

    activateUser(userId: string): Observable<IEmptyResponse> {
        return this.usersRepository.activateUser(userId);
    }

    deactivateUser(userId: string): Observable<IEmptyResponse> {
        return this.usersRepository.deactivateUser(userId);
    }
}