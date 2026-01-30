import { BaseHttpService } from '@/core/providers/base-http.service';
import { ILoginResponseEntity } from '@/domain/entities/auth/login-response.entity';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from 'src/app.config';
import { Observable } from 'rxjs';
import { ILoginParamsEntity } from '@/domain/entities/auth/login-params.entity';
import { LoginRepository } from '@/domain/repositories/auth/auth.repository';
import { IGeneralResponse } from '@SV-Development/utilities';
import { ISetCompanyResponseEntity } from '@/domain/entities/auth/set-company-response.entity';
import { IPermissionsResponseEntity } from '@/domain/entities/auth/permissions-response.entity';
import { ILogoutResponseEntity } from '@/domain/entities/auth/logout-response.entity';

@Injectable({
  providedIn: 'root'
})
export class LoginDatasourceService extends BaseHttpService<ILoginResponseEntity> implements LoginRepository {
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}`;


  login(credentials: ILoginParamsEntity): Observable<IGeneralResponse<ILoginResponseEntity>> {
    return this.post<IGeneralResponse<ILoginResponseEntity>>(credentials, 'auth/login');
  }

  setCompany(companyId: string): Observable<IGeneralResponse<ISetCompanyResponseEntity>> {
    return this.post<IGeneralResponse<ISetCompanyResponseEntity>>({ companyId }, 'auth/set-company');
  }

  getPermissions(): Observable<IGeneralResponse<IPermissionsResponseEntity>> {
    return this.get<IGeneralResponse<IPermissionsResponseEntity>>(`user/permissions`);
  }

  logout(): Observable<ILogoutResponseEntity> {
    return this.post<ILogoutResponseEntity>({}, 'auth/logout');
  }
}
