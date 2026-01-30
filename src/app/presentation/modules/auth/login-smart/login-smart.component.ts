import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { LoginDumpComponent } from '../login-dump/login-dump.component';
import { ILoginParamsEntity } from '@/domain/entities/auth/login-params.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { Store } from '@ngrx/store';
import { loginAction, setThemeAction, setCompanyAction, activeCompanyAction } from '@/store/actions/auth/auth.actions';
import { selectAuthCompanies, selectActiveCompany } from '@/store/selectors/auth.selectors';
import { ICompany } from '@/shared/entities/company.entity';
import { IBranding } from '@/shared/entities/branding.entity';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-smart',
  imports: [LoginDumpComponent],
  templateUrl: './login-smart.component.html',
  styleUrl: './login-smart.component.scss'
})
export class LoginSmartComponent implements OnInit, OnDestroy {
  private loadingService: LoadingService = inject(LoadingService);
  private store: Store = inject(Store);
  private companiesSubscription?: Subscription;
  private router = inject(Router);
  listCompanies = signal<ICompany[]>([]);
  onLogin($event: ILoginParamsEntity) {
    this.loadingService.setButtonLoading('login-button', true);
    this.loadingService.startLoading('general');
    this.store.dispatch(loginAction({ payload: $event }));
  }



  ngOnInit(): void {
    this.getCompaniesWithStore();
  }

  ngOnDestroy(): void {
    if (this.companiesSubscription) {
      this.companiesSubscription.unsubscribe();
    }
    this.loadingService.stopLoading('general');
    this.loadingService.setButtonLoading('login-button', false);
  }

  getCompaniesWithStore() {
    this.companiesSubscription = this.store.select(selectAuthCompanies).subscribe(companies => {
      if (companies.length > 0) {
        this.listCompanies.set(companies);
        // Autoseleccionar si hay solo una compañía
        if (companies.length === 1) {
          this.getPermission(companies[0].id.toString());
        }
      }
    });
  }

  getActiveCompany() {
    return this.store.select(selectActiveCompany);
  }

  setTheme(theme: IBranding) {
    this.store.dispatch(setThemeAction({ payload: theme }));
    this.setThemeColor(theme);
  }

  setThemeColor(theme: IBranding) {
    const root = document.documentElement;
    root.style.setProperty(`--primaryColor`, theme.primaryColor);
    root.style.setProperty(`--secundaryColor`, theme.secondaryColor);
    this.store.dispatch(setThemeAction({ payload: theme }));
    localStorage.setItem('branding', JSON.stringify(theme));
  }

  getPermission(permission: string) {
    const filterCompanies = this.listCompanies().filter((company: ICompany) => company.id === permission);
    if (filterCompanies.length > 0) {
      this.store.dispatch(setCompanyAction({ payload: permission }));
      this.store.dispatch(activeCompanyAction({ payload: filterCompanies[0] }));
    }
  }
}
