import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthTokens } from '@/store/selectors/auth.selectors';
import { switchMap, take, catchError, tap, of } from 'rxjs';
import { throwError } from 'rxjs';
import { logoutAction } from '@/store/actions/auth/auth.actions';
import { AuthCleanupService } from '@/shared/services/auth-cleanup.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);
  const authCleanupService = inject(AuthCleanupService);

  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  return store.select(selectAuthTokens).pipe(
    take(1),
    switchMap(tokens => {
      if (!tokens?.access_token) {
        return next(req);
      }

      if (!authCleanupService.isTokenValid(tokens.access_token)) {
        authCleanupService.clearAllAuthData();
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            authCleanupService.clearAllAuthData();
            if (!req.url.includes('/auth/')) {
              store.dispatch(logoutAction());
            }
          }
          return throwError(() => error);
        })
      );
    })
  );
};
