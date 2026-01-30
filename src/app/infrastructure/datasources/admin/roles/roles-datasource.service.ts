import { BaseHttpService } from '@/core/providers/base-http.service';
import { buildHttpParams } from '@/core/utils/build-http-params';
import { ICreateRolesParamsEntity } from '@/domain/entities/admin/roles/create-roles-params.entity';
import { IListRolesParamsEntity } from '@/domain/entities/admin/roles/list-roles-params.entity';
import { IListRolesResponseEntity } from '@/domain/entities/admin/roles/list-roles-response.entity';
import { IRoleDetailResponseEntity } from '@/domain/entities/admin/roles/role-detail-response.entity';
import { IUpdateRoleParamsEntity } from '@/domain/entities/admin/roles/update-role-params.entity';
import { RolesRepository } from '@/domain/repositories/admin/roles/roles.repository';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class RolesDatasourceService extends BaseHttpService<IListRolesResponseEntity> implements RolesRepository {
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}role/`;

  getAll(params: IListRolesParamsEntity): Observable<IListRolesResponseEntity> {
    return this.get<IListRolesResponseEntity>(``, { params: buildHttpParams(params) });
  }

  create(data: ICreateRolesParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>(data, ``);
  }

  getDetail(id: string): Observable<IRoleDetailResponseEntity> {
    return this.get<IRoleDetailResponseEntity>(`${id}`);
  }

  update(id: string, data: IUpdateRoleParamsEntity): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>(data, `${id}`);
  }

  deleteRole(id: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`delete/${id}`);
  }

  activateRole(id: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>({}, `activate/${id}`);
  }
}
