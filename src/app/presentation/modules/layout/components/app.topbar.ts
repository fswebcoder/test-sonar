import { Component, DestroyRef, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MegaMenuModule } from 'primeng/megamenu';
import { BadgeModule } from 'primeng/badge';
import { LayoutService } from '../service/layout.service';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { LogoutService } from '@/shared/services/logout.service';
import { AuthUseCase } from '@/domain/use-cases/auth/auth.usecase';
import { ACCEPT_LABEL_QUESTION_LOGOUT } from '@/shared/constants/general.contant';
import { activeCompanyAction, logoutAction, setCompanyAction, setThemeAction } from '@/store/actions/auth/auth.actions';
import { Store } from '@ngrx/store';
import { ICompany } from '@/shared/entities/company.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectActiveCompany, selectCompanies } from '@/store/selectors/auth.selectors';
import { SplitButtonModule } from 'primeng/splitbutton';
import { IBranding } from '@/shared/entities/branding.entity';
import { BrandingService } from '@/shared/services/branding.service';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { LoadingService } from '@/shared/services/loading.service';
import { DropdownButtonComponent } from '@/shared/components/dropdown-button/dropdown-button.component';
import { ToastCustomService } from '@SV-Development/utilities';
import { isDevMode } from '@angular/core';
import { environment } from 'src/enviromments/environment';

@Component({
  selector: '[app-topbar]',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    FormsModule,
    ButtonModule,
    MegaMenuModule,
    BadgeModule,
    ConfirmDialogComponent,
    SplitButtonModule,
    DropdownButtonComponent
  ],
  template: `
     <svi-confirm-dialog
            #confirmDialog
            header="Alerta de seguridad"
            [draggable]="false"
            [style]="{ width: '40rem' }"
            [acceptLabel]="'Cerrar sesión'"
            [rejectLabel]="'Cancelar'"
            [acceptButtonStyleClass]="'p-button-primary'"
            [rejectButtonStyleClass]="'p-button-outlined'"
            [acceptVisible]="true"
            [rejectVisible]="true"

          >

        </svi-confirm-dialog>
    <div class="layout-topbar-start">
      <a class="layout-topbar-logo" routerLink="/">
        <img src="Logo blanco horizontalSV.png" alt="logo" width="90px" />
      </a>
      <a #menuButton class="layout-menu-button" (click)="onMenuButtonClick()">
        <i class="pi pi-chevron-right"></i>
      </a>

      <button class="app-config-button app-config-mobile-button" (click)="toggleConfigSidebar()">
        <i class="pi pi-cog"></i>
      </button>

      <a #mobileMenuButton class="layout-topbar-mobile-button" (click)="onTopbarMenuToggle()">
        <i class="pi pi-ellipsis-v"></i>
      </a>
    </div>

    <div class="layout-topbar-end">
      <div class="layout-topbar-actions-start shadow-sm rounded-md">
        @if(activeCompany && activeCompany.name && model.length > 1) {
          <svi-dropdown-button
            [label]="'Empresa activa:' + ' ' + activeCompany.name.toUpperCase()" 
            [items]="model!"
            [disabled]="false"
            [styleClass]="'split-button-readonly'"
          />
        }   
        @if(isDevelopmentMode){
          <p-badge severity="secondary" value="SANDBOX"></p-badge>
        }
      </div>
      <div class="layout-topbar-actions-end">
        <ul class="layout-topbar-items">
          <!-- <li>
            <button class="app-config-button" (click)="toggleConfigSidebar()">
            <i class="fa-duotone fa-regular fa-gear"></i>
            </button>
          </li>
          <li>
            <a
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
              <p-overlay-badge severity="warn">
              <i class="fa-duotone fa-regular fa-bell"></i>
              </p-overlay-badge>
            </a>
            <div class="hidden">
              <ul class="list-none p-0 m-0">
                <li class="px-4 py-1">
                  <span>You have <b>4</b> new notifications</span>
                </li>
                <li class="p-4">
                  <div class="flex items-center">
                    <img src="/images/avatar/avatar-1.png" />
                    <div class="flex flex-col ml-4 flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-bold">Jerome Bell</span>
                        <small>42 mins ago</small>
                      </div>
                      <span class="text-sm leading-normal">How to write content about your photographs?</span>
                    </div>
                  </div>
                </li>
                <li class="p-4">
                  <div class="flex items-center">
                    <img src="/images/avatar/avatar-2.png" />
                    <div class="flex flex-col ml-4 flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="fs-small font-bold">Cameron Williamson</span>
                        <small>48 mins ago</small>
                      </div>
                      <span class="text-sm leading-normal">Start a blog to reach your creative peak.</span>
                    </div>
                  </div>
                </li>
                <li class="p-4">
                  <div class="flex items-center">
                    <img src="/images/avatar/avatar-3.png" />
                    <div class="flex flex-col ml-4 flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="fs-small font-bold">Anna Miles</span>
                        <small>1 day ago</small>
                      </div>
                      <span class="text-sm leading-normal">Caring is the new marketing</span>
                    </div>
                  </div>
                </li>
                <li class="p-4">
                  <div class="flex items-center">
                    <img src="/images/avatar/avatar-4.png" />
                    <div class="flex flex-col ml-4 flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="fs-small font-bold">Arlene Mccoy</span>
                        <small>4 day ago</small>
                      </div>
                      <span class="text-sm leading-normal">Starting your traveling blog with Vasco.</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
            <i class="fa-duotone fa-regular fa-grid-round-2-plus"></i>
            </a>
            <div class="hidden">
              <div class="flex flex-wrap">
                <div class="w-4/12 flex flex-col items-center p-4">
                  <button pButton pRipple rounded class="mb-2" icon="pi pi-image"></button>
                  <span>Products</span>
                </div>
                <div class="w-4/12 flex flex-col items-center p-4">
                  <button pButton pRipple rounded class="mb-2" severity="success" icon="pi pi-file-pdf"></button>
                  <span>Reports</span>
                </div>
                <div class="w-4/12 flex flex-col items-center p-4">
                  <button pButton pRipple rounded class="mb-2" severity="contrast" icon="pi pi-dollar"></button>
                  <span>Balance</span>
                </div>
                <div class="w-4/12 flex flex-col items-center p-4">
                  <button pButton pRipple rounded class="mb-2" severity="warn" icon="pi pi-cog"></button>
                  <span>Settings</span>
                </div>
                <div class="w-4/12 flex flex-col items-center p-4">
                  <button pButton pRipple rounded class="mb-2" severity="help" icon="pi pi-key"></button>
                  <span>Credentials</span>
                </div>
                <div class="w-4/12 flex flex-col items-center p-4">
                  <button pButton pRipple rounded class="mb-2" severity="info" icon="pi pi-sitemap"></button>
                  <span>Sitemap</span>
                </div>
              </div>
            </div>
          </li> -->
          <li>
            <a (click)="logout()" >
            <i class="fa-duotone fa-solid fa-right-from-bracket"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  host: {
    class: 'layout-topbar'
  },
  styles: `
    :host ::ng-deep .p-overlaybadge .p-badge {
      outline-width: 0px;
    }

    :host ::ng-deep .split-button-readonly .p-splitbutton-defaultbutton {
      pointer-events: none !important;
      cursor: default !important;   
      background: #7b8edc !important;  
      color: #fff !important;
      box-shadow: none !important;
      filter: none !important;
      opacity: 1 !important;         
    }

    :host ::ng-deep .split-button-readonly .p-splitbutton-defaultbutton:focus,
    :host ::ng-deep .split-button-readonly .p-splitbutton-defaultbutton:hover {
      background: #7b8edc !important; 
      color: #fff !important;
      box-shadow: none !important;
      filter: none !important;
    }

    :host ::ng-deep .split-button-readonly .p-splitbutton-menubutton {
      pointer-events: auto !important;
      cursor: pointer !important;
    }
  `
})
export class AppTopbar implements OnInit {
  layoutService = inject(LayoutService);
  viewChildDialog = viewChild<ConfirmDialogComponent>('confirmDialog');
  toastCustomService = inject(ToastCustomService);
  openModal = inject(LogoutService)
  authUseCase = inject(AuthUseCase);
  store = inject(Store);
  router = inject(Router);
  companies: ICompany[] = [];
  destroyRef = inject(DestroyRef);
  activeCompany: ICompany = {} as ICompany;
  brandingService = inject(BrandingService);
  actions$ = inject(Actions);
  loadingService = inject(LoadingService);
  isDevelopmentMode = !environment.production;
  
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef<HTMLButtonElement>;

  model: MegaMenuItem[] = [
  ];


  ngOnInit(): void {
    this.getActiveCompany();
    
    this.store.select(selectCompanies).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((companies) => {
      this.model = [];
      
      companies.forEach((company: ICompany) => {
        this.model.push({
          label: company.name,
          id: company.id,
          branding: company.branding,
          icon: 'fa-duotone fa-regular fa-building',
          command: (event) => {
            this.setTheme(event.item.branding); 
            this.loadingService.startLoading('general');
            this.store.dispatch(setCompanyAction({ payload: event.item.id }));
          }
        });
      });
      
      this.model = [...this.model];
    });

    this.actions$.pipe(
      ofType(activeCompanyAction),
      takeUntilDestroyed(this.destroyRef),
      tap(({ payload }) => {
        if (payload && payload.id) {
          this.activeCompany = payload;
        }
      })
    ).subscribe();
  }
  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onRightMenuButtonClick() {
    this.layoutService.openRightMenu();
  }

  toggleConfigSidebar() {
    let layoutState = this.layoutService.layoutState();

    if (this.layoutService.isSidebarActive()) {
      layoutState.overlayMenuActive = false;
      layoutState.overlaySubmenuActive = false;
      layoutState.staticMenuMobileActive = false;
      layoutState.menuHoverActive = false;
      layoutState.configSidebarVisible = false;
    }
    layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
    this.layoutService.layoutState.set({ ...layoutState });
  }

  focusSearchInput() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 150);
  }

  onTopbarMenuToggle() {
    this.layoutService.layoutState.update((val: any) => ({ ...val, topbarMenuActive: !val.topbarMenuActive }));
  }

  getActiveCompany() {
    this.store.select(selectActiveCompany).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((activeCompany) => {      
      if (activeCompany && activeCompany.id) {
        this.activeCompany = activeCompany;
        if (activeCompany.branding) {
          this.setTheme(activeCompany.branding);
        }
      }
    });
  }

  filterCompanyActive(company: ICompany) {
    return this.companies.filter((company: ICompany) => company.id === company.id);
  }
  
  logout() {
      this.viewChildDialog()?.show(
          ACCEPT_LABEL_QUESTION_LOGOUT,
          () => {
              this.activeCompany = {} as ICompany;
              this.store.dispatch(logoutAction());
          },
          () => {}
      );
  }

  setTheme(branding: IBranding) {

    this.brandingService.applyBranding(branding);
    this.brandingService.saveBranding(branding);
    this.store.dispatch(setThemeAction({ payload: branding }));
    if (this.activeCompany && this.activeCompany.branding === branding) {
      this.brandingService.saveActiveCompany(this.activeCompany);
    }
  }
  
}
