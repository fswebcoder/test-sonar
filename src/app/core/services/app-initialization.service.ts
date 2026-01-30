import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, filter, take, timeout, of } from 'rxjs';
import { StoreState } from '@/store/store.state';


@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {
  private store = inject(Store<StoreState>);
  private router = inject(Router);
  
  private appReadySubject = new BehaviorSubject<boolean>(false);
  public appReady$ = this.appReadySubject.asObservable();

  initializeApp(): Observable<boolean> {
    return new Observable(observer => {
      // Marcar la aplicación como lista inmediatamente para evitar bloqueos
      this.appReadySubject.next(true);
      observer.next(true);
      observer.complete();
    });
  }

  isAppReady(): boolean {
    return this.appReadySubject.value;
  }

  getInitialRoute(): string {
    try {
      const storedState = localStorage.getItem('app-state');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const hasValidTokens = parsedState.auth?.tokens?.access_token;
        
        if (hasValidTokens) {
          return '/home';
        }
      }
    } catch (error) {
      console.warn('Error al verificar estado inicial:', error);
    }
    
    return '/auth/login';
  }

  handleInitialNavigation(): void {
    const currentUrl = this.router.url;
    if (this.isAuthRoute(currentUrl)) {
      const initialRoute = this.getInitialRoute();
      if (currentUrl !== initialRoute && !currentUrl.includes(initialRoute)) {
        // this.router.navigate([initialRoute]);
      }
    }
  }

  private isAuthRoute(url: string): boolean {
    const authRoutes = ['/auth', '/auth/login', '/auth/register', '/auth/forgot-password'];
    const isExactAuthRoute = authRoutes.some(route => url === route || url.startsWith(route + '/'));
    const isRootRoute = url === '/' || url === '' || url === '#/';
    
    return isExactAuthRoute || isRootRoute;
  }
} 