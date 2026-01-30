import { ILoginParamsEntity } from '@/domain/entities/auth/login-params.entity';
import { ILoginResponseEntity } from '@/domain/entities/auth/login-response.entity';
import { ILogoutResponseEntity } from '@/domain/entities/auth/logout-response.entity';
import { ISetCompanyResponseEntity } from '@/domain/entities/auth/set-company-response.entity';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

export abstract class LoginRepository {
  abstract login(params: ILoginParamsEntity): Observable<IGeneralResponse<ILoginResponseEntity>>;
  abstract setCompany(companyId: string): Observable<IGeneralResponse<ISetCompanyResponseEntity>>;
  abstract getPermissions(): Observable<IGeneralResponse<any>>;
  abstract logout(): Observable<ILogoutResponseEntity>;
}
