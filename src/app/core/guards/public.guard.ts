import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, delay, of, switchMap, mergeMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { StoreState } from '@/store/store.state';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<StoreState>
  ) {}

  canActivate(): Observable<boolean> {
    return of(true).pipe(
      delay(100),
      switchMap(() => this.authService.hasValidToken()),
      mergeMap(hasValidToken => {
        if (hasValidToken) {
          // Si tiene token válido, verificar selección de empresa
          return this.authService.isInCompanySelection().pipe(
            map(isInSelection => {
              if (isInSelection) {
                return true;
              } else {
                try {
                  const storedState = localStorage.getItem('app-state');
                  if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    const companies = parsedState.auth?.companies || [];
                    const activeCompany = parsedState.auth?.activeCompany;
                    if (companies.length > 1 && (!activeCompany || !activeCompany.id)) {
                      return true;
                    }
                  }
                } catch (error) {
                  console.warn('Error al verificar empresas en PublicGuard:', error);
                }
                this.router.navigate(['/home']);
                return false;
              }
            })
          );
        }
        return of(true);
      }),
      take(1)
    );
  }
}
