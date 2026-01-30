import { createAction, props } from '@ngrx/store';
import { ILoginParamsEntity } from '@/domain/entities/auth/login-params.entity';
import { ILoginResponseEntity } from '@/domain/entities/auth/login-response.entity';
import { IBranding } from '@/shared/entities/branding.entity';
import { ISetCompanyResponseEntity } from '@/domain/entities/auth/set-company-response.entity';
import { ICompany } from '@/shared/entities/company.entity';
  
export const LOGIN = '[Auth] Login';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAILURE = '[Auth] Login Failure';

export const LOGOUT = '[Auth] Logout';
export const LOGOUT_SUCCESS = '[Auth] Logout Success';
export const LOGOUT_FAILURE = '[Auth] Logout Failure';

export const SET_THEME = '[Auth] Set Theme';
export const SET_COMPANY = '[Auth] Set Company';
export const SET_COMPANY_SUCCESS = '[Auth] Set Company Success';
export const SET_COMPANY_FAILURE = '[Auth] Set Company Failure';

export const GET_PERMISSIONS = '[Auth] Get Permissions';
export const GET_PERMISSIONS_SUCCESS = '[Auth] Get Permissions Success';
export const GET_PERMISSIONS_FAILURE = '[Auth] Get Permissions Failure';

export const ACTIVE_COMPANY = '[Auth] Active Company';

export const loginAction = createAction(LOGIN, props<{ payload: ILoginParamsEntity }>());

export const loginSuccessAction = createAction(LOGIN_SUCCESS, props<{ payload: ILoginResponseEntity }>());

export const loginFailureAction = createAction(LOGIN_FAILURE, props<{ error: any }>());

export const logoutAction = createAction(LOGOUT);
export const logoutSuccessAction = createAction(LOGOUT_SUCCESS);
export const logoutFailureAction = createAction(LOGOUT_FAILURE, props<{ error: any }>());

export const setThemeAction = createAction(SET_THEME, props<{ payload: IBranding }>());

export const setCompanyAction = createAction(SET_COMPANY, props<{ payload: string }>());

export const setCompanySuccessAction = createAction(
  SET_COMPANY_SUCCESS,
  props<{ payload: ISetCompanyResponseEntity }>()
);

export const setCompanyFailureAction = createAction(SET_COMPANY_FAILURE, props<{ error: any }>());

export const getPermissionsAction = createAction(GET_PERMISSIONS);

export const getPermissionsSuccessAction = createAction(GET_PERMISSIONS_SUCCESS, props<{ payload: any }>());

export const getPermissionsFailureAction = createAction(GET_PERMISSIONS_FAILURE, props<{ error: any }>());

export const activeCompanyAction = createAction(ACTIVE_COMPANY, props<{ payload: ICompany }>());