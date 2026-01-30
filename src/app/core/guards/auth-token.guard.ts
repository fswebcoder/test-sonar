import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, delay, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return of(true).pipe(
      delay(100), 
      switchMap(() => this.authService.hasValidToken()),
      take(1), 
      map(hasValidToken => {
        if (!hasValidToken) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    );
  }
} 