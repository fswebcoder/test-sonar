import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { logoutAction } from '@/store/actions/auth/auth.actions';
import { BrandingService } from './branding.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCleanupService {

  constructor(
    private store: Store,
    private brandingService: BrandingService,
    private loadingService: LoadingService
  ) {}


  clearAllAuthData(): void {
    try {
      localStorage.removeItem('app-state');
      localStorage.removeItem('permissions');
      localStorage.removeItem('activeCompany');
      localStorage.removeItem('formFields');
      localStorage.removeItem('token');
      
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      this.brandingService.clearAll();
      this.loadingService.resetAll();
      
    } catch (error) {
      console.error('Error al limpiar datos de autenticación:', error);
    }
  }

  isTokenValid(token: string): boolean {
    if (!token || token.trim().length === 0) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  cleanupExpiredData(): void {
    try {
      const storedState = localStorage.getItem('app-state');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const storedToken = parsedState.auth?.tokens?.access_token;
        
        if (storedToken && !this.isTokenValid(storedToken)) {
          this.clearAllAuthData();
        }
      }
    } catch (error) {
      this.clearAllAuthData();
    }
  }


  initializeAuthCleanup(): void {
    this.cleanupExpiredData();
  }

  forceLogout(): void {
    this.clearAllAuthData();
    this.store.dispatch(logoutAction());
  }
} 