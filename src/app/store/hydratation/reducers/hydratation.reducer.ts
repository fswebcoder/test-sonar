import { Action, ActionReducer } from '@ngrx/store';
import { StoreState } from '../../store.state';
import { HYDRATE_SUCCESS } from '../actions/hydratation.actions';
import { AuthState, initialAuthState } from '@/store/models/auth/auth.model';
import { CommonState, initialCommonState } from '@/store/models/common/common.model';
import { IBranding } from '@/shared/entities/branding.entity';
import { ICompany } from '@/shared/entities/company.entity';

function isHydrateSuccess(action: Action): action is ReturnType<typeof HYDRATE_SUCCESS> {
  return action.type === '[Hydratation] Hydrate Success';
}

export const HYDRATATION_META_REDUCER = (reducer: ActionReducer<StoreState>): ActionReducer<StoreState> => {
  return (state, action) => {
    if (isHydrateSuccess(action)) {
      const hydratedAuth: AuthState = action.state.auth
        ? {
            ...action.state.auth,
            loading: false,
            isAutenticated: true,
            error: null,
            permissions: action.state.auth.permissions || null,
            branding: action.state.auth.branding || {} as IBranding,
            activeCompany: action.state.auth.activeCompany || {} as ICompany 
          }
        : state?.auth || initialAuthState;

      const hydratedCommon: CommonState = action.state.common
        ? {
            ...action.state.common,
            loading: false,
            error: null,
            departments: action.state.common.departments || [],
            cities: action.state.common.cities || [],
            printers: action.state.common.printers || []
          }
        : state?.common || initialCommonState;

      return {
        ...action.state,
        auth: hydratedAuth,
        common: hydratedCommon,
        router: state?.router || action.state.router
      } as StoreState;
    }

    return reducer(state, action);
  };
};

export const isAuthenticated = (state: StoreState): boolean => {
  return state?.auth?.isAutenticated ?? false;
};
