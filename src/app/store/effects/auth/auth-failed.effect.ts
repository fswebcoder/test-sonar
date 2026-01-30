import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { loginFailureAction } from '../../actions/auth/auth.actions';
import { Injectable } from '@angular/core';
import { ERROR_AUTHENTICATION_TITLE } from '@/shared/constants/general.contant';
import { ToastCustomService } from '@SV-Development/utilities';

@Injectable({
  providedIn: 'root'
})
export class AuthFailedEffect {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private toastCustomService = inject(ToastCustomService);
  authFailedEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailureAction),
        tap(action => {
          this.toastCustomService.error(ERROR_AUTHENTICATION_TITLE, action.error, { life: 5000 });
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
