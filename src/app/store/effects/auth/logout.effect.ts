import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap, catchError, mergeMap } from 'rxjs';
import { logoutAction, logoutSuccessAction } from '@/store/actions/auth/auth.actions';
import { clearFormFieldsAction } from '@/store/actions/admin/suppliers/suppliers.actions';
import { AuthUseCase } from '@/domain/use-cases/auth/auth.usecase';
import { BrandingService } from '@/shared/services/branding.service';
import { LoadingService } from '@/shared/services/loading.service';
import { AuthCleanupService } from '@/shared/services/auth-cleanup.service';
import { ToastCustomService } from '@SV-Development/utilities';


@Injectable({
  providedIn: 'root'
})
export class LogoutEffect {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private store = inject(Store);
  private authUseCase = inject(AuthUseCase);
  private toastCustomService = inject(ToastCustomService);
  private brandingService = inject(BrandingService);
  private loadingService = inject(LoadingService);
  private authCleanupService = inject(AuthCleanupService);


  logoutEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutAction),
      switchMap(() => {
        
        return this.authUseCase.logout().pipe(
          mergeMap(response => {
            if (response.success) {
              this.authCleanupService.clearAllAuthData();
              this.router.navigate(['/auth/login']);
              return [clearFormFieldsAction(), logoutSuccessAction()];
            } else {
              this.authCleanupService.clearAllAuthData();
              this.router.navigate(['/auth/login']);
              return [clearFormFieldsAction(), logoutSuccessAction()];
            }
          }),
          catchError((error) => {
            this.authCleanupService.clearAllAuthData();
            this.router.navigate(['/auth/login']);
            return [clearFormFieldsAction(), logoutSuccessAction()];
          })
        );
      })
    )
  );
} 