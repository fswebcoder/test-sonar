import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, of } from 'rxjs';
import { StoreState } from '@/store/store.state';
import { selectAuthTokens, selectIsAuthenticated } from '@/store/selectors/auth.selectors';
import { AuthCleanupService } from '@/shared/services/auth-cleanup.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private store: Store<StoreState>,
    private authCleanupService: AuthCleanupService
  ) {}


  hasValidToken(): Observable<boolean> {
    return this.store.select(selectAuthTokens).pipe(
      map(tokens => {
        // Primero verificar si hay tokens en el store
        if (tokens && tokens.access_token && this.authCleanupService.isTokenValid(tokens.access_token)) {
          return true;
        }
        
        // Si no hay tokens en el store, verificar localStorage
        try {
          const storedState = localStorage.getItem('app-state');
          if (storedState) {
            const parsedState = JSON.parse(storedState);
            const storedTokens = parsedState.auth?.tokens;
            const isAuthenticated = parsedState.auth?.isAutenticated;
            
            // Si explícitamente está marcado como no autenticado, retornar false
            if (isAuthenticated === false) {
              return false;
            }
            
            // Verificar si hay tokens válidos en localStorage
            if (storedTokens && 
                storedTokens.access_token && 
                this.authCleanupService.isTokenValid(storedTokens.access_token)) {
              return true;
            }
            // No limpiar automáticamente para evitar bloqueos
          }
        } catch (error) {
          console.warn('Error al verificar tokens en localStorage:', error);
          // No limpiar automáticamente para evitar bloqueos
        }
        
        return false;
      })
    );
  }

  getAccessToken(): Observable<string | null> {
    return this.store.select(selectAuthTokens).pipe(
      map(tokens => {
        if (tokens?.access_token && this.authCleanupService.isTokenValid(tokens.access_token)) {
          return tokens.access_token;
        }
        
        try {
          const storedState = localStorage.getItem('app-state');
          if (storedState) {
            const parsedState = JSON.parse(storedState);
            
            const isAuthenticated = parsedState.auth?.isAutenticated;
            if (isAuthenticated === false) {
              return null;
            }
            
            const storedToken = parsedState.auth?.tokens?.access_token;
            if (storedToken && this.authCleanupService.isTokenValid(storedToken)) {
              return storedToken;
            }
            // No limpiar automáticamente para evitar bloqueos
          }
        } catch (error) {
          console.warn('Error al obtener token de localStorage:', error);
          // No limpiar automáticamente para evitar bloqueos
        }
        
        return null;
      })
    );
  }

  isTokenExpired(): Observable<boolean> {
    return this.getAccessToken().pipe(
      map(token => !token)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.hasValidToken().pipe(
      map(hasToken => {
        if (!hasToken) return false;
        
        try {
          const storedState = localStorage.getItem('app-state');
          if (storedState) {
            const parsedState = JSON.parse(storedState);
            const isAuthenticated = parsedState.auth?.isAutenticated;
            
            if (isAuthenticated === false) {
              return false;
            }
            
            return isAuthenticated === true || hasToken;
          }
        } catch (error) {
          console.warn('Error al verificar estado de autenticación:', error);
        }
        
        return hasToken; 
      })
    );
  }

  isInCompanySelection(): Observable<boolean> {
    return this.store.select(selectAuthTokens).pipe(
      map(tokens => {
        if (!tokens?.access_token) return false;
        
        try {
          const storedState = localStorage.getItem('app-state');
          if (storedState) {
            const parsedState = JSON.parse(storedState);
            const companies = parsedState.auth?.companies || [];
            const activeCompany = parsedState.auth?.activeCompany;
            return companies.length > 1 && (!activeCompany || !activeCompany.id);
          }
        } catch (error) {
          console.warn('Error al verificar selección de empresa:', error);
        }
        
        return false;
      })
    );
  }
} 