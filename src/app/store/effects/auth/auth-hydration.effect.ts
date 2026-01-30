import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap} from 'rxjs';
import { HYDRATE_SUCCESS } from '@/store/hydratation/actions/hydratation.actions';
import { setThemeAction, activeCompanyAction } from '@/store/actions/auth/auth.actions';
import { BrandingService } from '@/shared/services/branding.service';


@Injectable({
  providedIn: 'root'
})
export class AuthHydrationEffect {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private store = inject(Store);
  private brandingService = inject(BrandingService);


  handleHydrationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HYDRATE_SUCCESS),
        tap(({ state }) => {
          this.handleAuthenticatedUserNavigation(state);
        })
      ),
    { dispatch: false }
  );

  private handleAuthenticatedUserNavigation(state: any): void {
    if (!this.isUserAuthenticated(state)) {
      return;
    }


    if (this.isUserOnLoginPage() && !this.shouldStayOnLoginPage(state)) {
      this.navigateToHome();
    }
  }

  private isUserAuthenticated(state: any): boolean {
    return state.auth && state.auth.tokens?.access_token;
  }


  private isUserOnLoginPage(): boolean {
    return this.router.url.includes('/auth/login');
  }


  private shouldStayOnLoginPage(state: any): boolean {
    const hasMultipleCompanies = this.hasMultipleCompanies(state);
    
    if (hasMultipleCompanies) {
      return true;
    }

    const hasActiveCompany = this.hasActiveCompany(state);
    return !hasActiveCompany;
  }

  private hasMultipleCompanies(state: any): boolean {
    return state.auth.companies && state.auth.companies.length > 1;
  }


  private hasActiveCompany(state: any): boolean {
    return state.auth.activeCompany && state.auth.activeCompany.id;
  }

  private navigateToHome(): void {
    this.router.navigate(['/home']);
  }





  handleBrandingSelection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setThemeAction),
        tap(({ payload }) => {
          this.brandingService.applyBranding(payload);
          this.brandingService.saveBranding(payload);
        })
      ),
    { dispatch: false }
  );


  handleActiveCompanySelection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(activeCompanyAction),
        tap(({ payload }) => {
          this.brandingService.saveActiveCompany(payload);
          if (payload.branding) {
            this.brandingService.applyBranding(payload.branding);
            this.brandingService.saveBranding(payload.branding);
            this.store.dispatch(setThemeAction({ payload: payload.branding }));
          }
        })
      ),
    { dispatch: false }
  );
} 