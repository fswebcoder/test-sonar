import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, mergeMap, tap, withLatestFrom } from 'rxjs';
import { HYDRATE, HYDRATE_SUCCESS } from '../actions/hydratation.actions';
import { StoreState } from '../../store.state';
import { loginSuccessAction, setThemeAction, activeCompanyAction } from '@/store/actions/auth/auth.actions';
import { LoadingService } from '@/shared/services/loading.service';
import { getPermissionsSuccessAction } from '@/store/actions/auth/auth.actions';
import { departmentsListSuccessAction } from '@/store/actions/common/common.action';
import { getFormFieldsSuccessAction } from '@/store/actions/admin/suppliers/suppliers.actions';
import { BrandingService } from '@/shared/services/branding.service';
import { AuthCleanupService } from '@/shared/services/auth-cleanup.service';

@Injectable({
  providedIn: 'root'
})
export class HydratationEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<StoreState>);
  private loadingService = inject(LoadingService);
  private brandingService = inject(BrandingService);
  private authCleanupService = inject(AuthCleanupService);

  private saveStateToLocalStorage(state: StoreState) {
    const stateToSave = {
      branding: state.auth.branding,
      permissions: state.auth.permissions,
      activeCompany: state.auth.activeCompany, 
      auth: state.auth
        ? {
            ...state.auth,
            loading: false,
            branding: state.auth.branding,
            permissions: state.auth.permissions,
            activeCompany: state.auth.activeCompany
          }
        : null,
      common: state.common
        ? {
            ...state.common,
            loading: false,
            departments: state.common.departments,
            cities: state.common.cities
          }
        : null,
      suppliers: state.suppliers
        ? {
            ...state.suppliers,
            loading: false,
            formFields: state.suppliers.formFields
          }
        : null
    };

    if (stateToSave.auth || stateToSave.common || stateToSave.suppliers) {
      localStorage.setItem('app-state', JSON.stringify(stateToSave));
      localStorage.setItem('branding', JSON.stringify(stateToSave.branding));
      localStorage.setItem('permissions', JSON.stringify(stateToSave.permissions));
      localStorage.setItem('activeCompany', JSON.stringify(stateToSave.activeCompany)); 
      localStorage.setItem('formFields', JSON.stringify(stateToSave.suppliers?.formFields));
    }
  }

  saveState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccessAction),
        withLatestFrom(this.store),
        tap(([_, state]) => {
          this.saveStateToLocalStorage(state);
          this.loadingService.setButtonLoading('login-button', false);
          this.loadingService.stopLoading('general');
        })
      ),
    { dispatch: false }
  );

  saveThemeState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setThemeAction),
        withLatestFrom(this.store),
        tap(([_, state]) => {
          this.saveStateToLocalStorage(state);
        })
      ),
    { dispatch: false }
  );

  saveDepartmentsState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(departmentsListSuccessAction),
        withLatestFrom(this.store),
        tap(([_, state]) => {
          this.saveStateToLocalStorage(state);
        })
      ),
    { dispatch: false }
  );

  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HYDRATE),
      mergeMap(() => {
        const storageValue = localStorage.getItem('app-state');
        const activeCompanyValue = localStorage.getItem('activeCompany'); 
        if (storageValue) {
          try {
            const state = JSON.parse(storageValue);
            if (state.auth || state.common) {
              if (state.auth?.tokens?.access_token) {
                try {
                  const payload = JSON.parse(atob(state.auth.tokens.access_token.split('.')[1]));
                  const currentTime = Date.now() / 1000;
                  
                  if (payload.exp < currentTime) {
                    console.warn('Token expirado encontrado durante hidratación, limpiando datos');
                    this.authCleanupService.clearAllAuthData();
                    return [HYDRATE_SUCCESS({ state: {} })];
                  }
                } catch (error) {
                  console.warn('Token inválido encontrado durante hidratación, limpiando datos');
                  this.authCleanupService.clearAllAuthData();
                  return [HYDRATE_SUCCESS({ state: {} })];
                }
              }
              
              if (state.auth) {
                state.auth.loading = false;
                state.auth.branding = state.auth.branding || {};
                if (activeCompanyValue) {
                  state.auth.activeCompany = JSON.parse(activeCompanyValue);
                }
              }
              if (state.common) {
                state.common.loading = false;
                state.common.departments = state.common.departments || [];
                state.common.cities = state.common.cities || [];
              }
              if (state.suppliers) {
                state.suppliers.loading = false;
                state.suppliers.formFields = state.suppliers.formFields || [];
              }
              this.loadingService.setButtonLoading('login-button', false);
              this.loadingService.stopLoading('general');
              return [HYDRATE_SUCCESS({ state })];
            }
          } catch (error) {
            console.warn('Error al parsear estado del localStorage:', error);
            this.authCleanupService.clearAllAuthData();
            return [HYDRATE_SUCCESS({ state: {} })];
          }
        }
        return [HYDRATE_SUCCESS({ state: {} })];
      })
    )
  );



  applyBrandingAfterHydration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HYDRATE_SUCCESS),
        tap(({ state }) => {
          if (state.auth?.branding && Object.keys(state.auth.branding).length > 0) {
            this.brandingService.applyBranding(state.auth.branding);
          }
        })
      ),
    { dispatch: false }
  );

  restoreActiveCompanyAfterHydration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HYDRATE_SUCCESS),
        tap(({ state }) => {
          if (state.auth?.activeCompany && state.auth.activeCompany.id) {
            this.store.dispatch(activeCompanyAction({ payload: state.auth.activeCompany }));
          }
        })
      ),
    { dispatch: false }
  );

  savePermissionsState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getPermissionsSuccessAction),
        withLatestFrom(this.store),
        tap(([_, state]) => {
          this.saveStateToLocalStorage(state);
        })
      ),
    { dispatch: false }
  );

  saveFormFieldsState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getFormFieldsSuccessAction),
        withLatestFrom(this.store),
        tap(([_, state]) => {
          this.saveStateToLocalStorage(state);
        })
      ),
    { dispatch: false }
  );
}
