import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Store } from '@ngrx/store';
import { HYDRATE, HYDRATE_SUCCESS } from './store/hydratation/actions/hydratation.actions';
import { StoreState } from './store/store.state';
import { IBranding } from './shared/entities/branding.entity';
import { AppInitializationService } from './core/services/app-initialization.service';
import { setThemeAction } from './store/actions/auth/auth.actions';
import { BrandingService } from './shared/services/branding.service';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { AuthCleanupService } from './shared/services/auth-cleanup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastModule],
  template: `<p-toast
      [autoZIndex]="true"
      [breakpoints]="{ '400px': 1, '500px': 2 }"
      [position]="'top-right'"
    /><router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<StoreState>,
    private appInitService: AppInitializationService,
    private brandingService: BrandingService,
    private actions$: Actions,
    private authCleanupService: AuthCleanupService
  ) {}

  ngOnInit() {
    this.authCleanupService.initializeAuthCleanup();
    this.initializeApp();
  }

  private initializeApp(): void {
    this.store.dispatch(HYDRATE());
    let branding = localStorage.getItem('branding');
    if(branding){
      this.brandingService.applyBranding(JSON.parse(branding));
    }else {
      const root = document.documentElement;
      root.style.setProperty(`--primaryColor`,'#6F3C0D');
      root.style.setProperty(`--secundaryColor`,  '#6F3C0D');
    }
    this.actions$.pipe(
      ofType(HYDRATE_SUCCESS),
      tap(({ state }) => {
        this.applyBrandingAfterHydration(state);
      })
    ).subscribe();
    
    this.appInitService.initializeApp().subscribe({
      next: (ready) => {
        if (ready) {
          this.appInitService.handleInitialNavigation();
        }
      },
      error: (error) => {
        console.error('AppComponent: Error en inicialización:', error);
      }
    });
  }

  private applyBrandingAfterHydration(state: any): void {
    if (state.auth?.activeCompany?.branding && Object.keys(state.auth.activeCompany.branding).length > 0) {
      this.brandingService.applyBranding(state.auth.activeCompany.branding);
      this.store.dispatch(setThemeAction({ payload: state.auth.activeCompany.branding }));
    }
    else if (state.auth?.branding && Object.keys(state.auth.branding).length > 0) {
      this.brandingService.applyBranding(state.auth.branding);
      this.store.dispatch(setThemeAction({ payload: state.auth.branding }));
    }
    else {
      this.getBranding();
    }
  }

  getBranding() {
    const activeCompany = this.brandingService.loadActiveCompany();
    if (activeCompany?.branding && Object.keys(activeCompany.branding).length > 0) {
      this.store.dispatch(setThemeAction({ payload: activeCompany.branding }));
      this.brandingService.applyBranding(activeCompany.branding);
      return;
    }

    const branding = this.brandingService.loadBranding();
    if (branding && Object.keys(branding).length > 0) {
      this.store.dispatch(setThemeAction({ payload: branding }));
      this.brandingService.applyBranding(branding);
    }
  }

  setThemeColor(company: IBranding) {
    this.brandingService.applyBranding(company);
  }
}
