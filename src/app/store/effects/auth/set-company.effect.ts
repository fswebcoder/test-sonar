import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import {
  setCompanyAction,
  setCompanyFailureAction,
  setCompanySuccessAction,
  getPermissionsAction,
  setThemeAction,
  activeCompanyAction
} from '../../actions/auth/auth.actions';
import { ofType } from '@ngrx/effects';
import { AuthUseCase } from '@/domain/use-cases/auth/auth.usecase';
import { switchMap, map, catchError, of, concatMap, tap, withLatestFrom, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthCompanies } from '@/store/selectors/auth.selectors';
import { IBranding } from '@/shared/entities/branding.entity';
import { BrandingService } from '@/shared/services/branding.service';

@Injectable({
  providedIn: 'root'
})
export class SetCompanyEffect {
  private actions$ = inject(Actions);
  private authUseCase = inject(AuthUseCase);
  private store = inject(Store);
  private brandingService = inject(BrandingService);

  setCompanyEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCompanyAction),
      switchMap(({ payload }) =>
        this.authUseCase.setCompany(payload).pipe(
          concatMap(response => {
            return [setCompanySuccessAction({ payload: response.data }), getPermissionsAction()];
          }),
          catchError(error => of(setCompanyFailureAction({ error })))
        )
      )
    )
  );

  setActiveCompanyAfterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCompanySuccessAction),
      withLatestFrom(this.store.select(selectAuthCompanies)),
      map(([{ payload }, companies]) => {
        const currentCompanyId = this.getCurrentCompanyId();
        const selectedCompany = companies.find(company => company.id === currentCompanyId);
        if (selectedCompany) {
          return activeCompanyAction({ payload: selectedCompany });
        }
        return { type: 'NO_ACTION' };
      }),
      filter(action => action.type !== 'NO_ACTION')
    )
  );

  applyBrandingOnCompanyChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setCompanySuccessAction),
        tap(({ payload }) => {
          this.store.select(selectAuthCompanies).subscribe(companies => {
            const currentCompanyId = this.getCurrentCompanyId();
            const selectedCompany = companies.find(company => company.id === currentCompanyId);
            if (selectedCompany?.branding) {              
              this.brandingService.applyBranding(selectedCompany.branding);
              this.brandingService.saveBranding(selectedCompany.branding);
              this.brandingService.saveActiveCompany(selectedCompany);
              this.store.dispatch(setThemeAction({ payload: selectedCompany.branding }));
            }
          });
        })
      ),
    { dispatch: false }
  );

  private getCurrentCompanyId(): string | null {
    let companyId: string | null = null;
    this.store.select(state => state.auth.companyId).subscribe(id => {
      companyId = id;
    });
    return companyId;
  }
}
