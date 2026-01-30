import { IBranding } from '@/shared/entities/branding.entity';
import { ITokens } from '@/shared/entities/tokens.entity';
import {
  loginAction,
  loginFailureAction,
  loginSuccessAction,
  logoutAction,
  logoutSuccessAction,
  logoutFailureAction,
  setThemeAction,
  setCompanyAction,
  setCompanyFailureAction,
  setCompanySuccessAction,
  getPermissionsAction,
  getPermissionsSuccessAction,
  getPermissionsFailureAction,
  activeCompanyAction,
} from '@/store/actions/auth/auth.actions';
import { initialAuthState } from '@/store/models/auth/auth.model';
import { createReducer, on } from '@ngrx/store';

export const authReducer = createReducer(
  initialAuthState,
  on(loginAction, state => ({ ...state, loading: true })),
  on(loginSuccessAction, (state, { payload }) => ({
    ...state,
    loading: false,
    isAutenticated: true,
    companies: payload.companies,
    userId: payload.id.toString(),
    tokens: payload.tokens,
    name: payload.name,
    email: payload.email
  })),
  on(loginFailureAction, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
    isAutenticated: false,
    companies: [],
    companyId: null,
    tokens: {} as ITokens,
    name: '',
    username: ''
  })),
  on(logoutAction, state => ({ ...state, loading: true })),
  on(logoutSuccessAction, () => initialAuthState),
  on(logoutFailureAction, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  on(setThemeAction, (state, { payload }) => ({
    ...state,
    branding: payload
  })),
  on(setCompanyAction, (state, { payload }) => ({
    ...state,
    companyId: payload
  })),
  on(setCompanySuccessAction, (state, { payload }) => ({
    ...state,
    tokens: {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token
    }
  })),
  on(setCompanyFailureAction, (state, { error }) => ({
    ...state,
    error: error
  })),
  on(getPermissionsAction, (state) => ({
    ...state,
    loading: true
  })),
  on(getPermissionsSuccessAction, (state, { payload }) => ({
    ...state,
    loading: false,
    permissions: payload.permissions,
    branding: payload.branding ?? state.branding
  })),
  on(getPermissionsFailureAction, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  on(activeCompanyAction, (state, { payload }) => ({
    ...state,
    activeCompany: payload
  }))

);
