import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { ICreateUsersParamsEntity } from "@/domain/entities/admin/users/create-users-params.entity";
import { IUpdateUsersParamsEntity } from "@/domain/entities/admin/users/update-users-params.entity";
import { IUserEntity } from "@/domain/entities/admin/users/user.entity";
import { UsersRepository } from "@/domain/repositories/admin/users/users.repository";
import { IFlexibleApiResponse } from "@/shared/interfaces/api-response.interface";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class UsersDatasourceService extends BaseHttpService<undefined> implements UsersRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}user/`;

    create(params: ICreateUsersParamsEntity): Observable<IFlexibleApiResponse<IEmptyResponse, 'single'>> {
        return this.post<IFlexibleApiResponse<IEmptyResponse, 'single'>>(params, "create");
    }   

    getAll(params: TPaginationParams): Observable<IFlexibleApiResponse<IUserEntity, 'paginated'>> {
        return this.get<IFlexibleApiResponse<IUserEntity, 'paginated'>>("", { params: buildHttpParams(params) });
    }

    update(params: IUpdateUsersParamsEntity): Observable<IEmptyResponse> {
        const { userId, ...updateParams } = params;
        return this.patch<IEmptyResponse>(updateParams, `${userId}`);
    }
    changeUserStatus(userId: string): Observable<IEmptyResponse> {
        return this.patch<IEmptyResponse>(undefined, `activate/${userId}`);
    }

    activateUser(userId: string): Observable<IEmptyResponse> {
        return this.patch<IEmptyResponse>(undefined, `activate/${userId}`);
    }

    deactivateUser(userId: string): Observable<IEmptyResponse> {
        return this.delete<IEmptyResponse>(`delete/${userId}`);
    }
}