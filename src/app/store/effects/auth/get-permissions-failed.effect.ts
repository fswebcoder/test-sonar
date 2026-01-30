import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { getPermissionsFailureAction } from '../../actions/auth/auth.actions';

@Injectable()
export class GetPermissionsFailedEffect {
  private actions$ = inject(Actions);
  private router = inject(Router);
  getPermissionsFailedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPermissionsFailureAction),
      tap(() => this.router.navigate(['/login']))
    )
  );
}
