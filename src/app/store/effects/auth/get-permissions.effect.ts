import { AuthUseCase } from '@/domain/use-cases/auth/auth.usecase';
import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  getPermissionsAction,
  getPermissionsSuccessAction,
  getPermissionsFailureAction,
  logoutAction,
  setThemeAction,
  activeCompanyAction
} from '../../actions/auth/auth.actions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '@/shared/services/loading.service';
import { BrandingService } from '@/shared/services/branding.service';


@Injectable({
  providedIn: 'root',
  deps: [Actions, AuthUseCase]
})
export class PermissionEffects {
  private actions$ = inject(Actions);
  private authUseCase = inject(AuthUseCase);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private store = inject(Store);
  private brandingService = inject(BrandingService);

  getPermissionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPermissionsAction),
      switchMap(() => {
        return this.authUseCase.getPermissions().pipe(
          map(response => {
            this.loadingService.stopLoading('general');

            const permissions = response.data.permissions ?? response.data;
            const branding = response.data.branding ?? null;
            const company = response.data.company ?? null;

            if (branding) {
              this.brandingService.applyBranding(branding);
              this.brandingService.saveBranding(branding);
              this.store.dispatch(setThemeAction({ payload: branding }));
            }

            if (company) {
              this.brandingService.saveActiveCompany(company);
              this.store.dispatch(activeCompanyAction({ payload: company }));
            }

            return getPermissionsSuccessAction({ payload: {
              permissions: permissions,
              branding: branding
            }});
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.store.dispatch(logoutAction());
            }
            return of(getPermissionsFailureAction({ error: error.message }));
          })
        );
      })
    )
  );

  navigateAfterPermissionsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getPermissionsSuccessAction),
        tap(() => {
          if (this.router.url.includes('/auth/login')) {
            this.router.navigate(['/home']);
          }
        })
      ),
    { dispatch: false }
  );
}
