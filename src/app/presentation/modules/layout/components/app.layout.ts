import { Component, computed, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppFooter } from './app.footer';
import { AppConfigurator } from './app.configurator';
import { AppBreadcrumb } from './app.breadcrumb';
import { AppSidebar } from './app.sidebar';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LayoutService } from '../service/layout.service';
import { AppRightMenu } from './app.rightmenu';
import { LoadingComponent } from '@/shared/components/loading/loading.component';
import { getCitiesAction, getDepartmentsAction, getPrintersAction, getDocumentTypesAction, getRolesAction, getPersonnelPositionAction, getPersonnelAction, getShiftsConfigAction, getPumpsAction, getAnalysisTypesAction, getSampleTypesAction, getSuppliersAction, getVehicleTypesAction, getMaterialTypesAction, getStorageZonesAction, getDriversAction, getVehiclesAction, getMillsAction, getBigBagTypesAction } from '@/store/actions/common/common.action';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    AppTopbar,
    AppSidebar,
    RouterModule,
    AppFooter,
    AppConfigurator,
    AppBreadcrumb,
    AppRightMenu,
    Toast,
    LoadingComponent,
  ],
  template: `
    <app-loading section="general" [options]="{ fullscreen: true }"></app-loading>
    <div class="layout-container" [ngClass]="containerClass()">
      <div app-topbar></div>
      <div app-right-menu></div>
      <div app-sidebar></div>
      <div class="layout-content-wrapper">
        <div app-breadcrumb></div>
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
        <div app-footer></div>
      </div>
    </div>
    <app-configurator />
    <p-toast />
  `,
  providers: [MessageService]
})
export class AppLayout implements OnDestroy, OnInit {
  private store = inject(Store);
  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  menuScrollListener: any;

  @ViewChild(AppSidebar) appSidebar!: AppSidebar;

  @ViewChild(AppTopbar) appTopbar!: AppTopbar;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router
  ) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(
            this.appSidebar.appMenu.el.nativeElement.isSameNode(event.target) ||
            this.appSidebar.appMenu.el.nativeElement.contains(event.target) ||
            this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
            this.appTopbar.menuButton.nativeElement.contains(event.target)
          );
          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if ((this.layoutService.isSlim() || this.layoutService.isSlimPlus()) && !this.menuScrollListener) {
        this.menuScrollListener = this.renderer.listen(
          this.appSidebar.appMenu.menuContainer.nativeElement,
          'scroll',
          event => {
            if (this.layoutService.isDesktop()) {
              this.hideMenu();
            }
          }
        );
      }

      if (this.layoutService.layoutState().staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu();
    });
  }

  ngOnInit(): void {
    this.getCommon();
  }

  getCommon() {
    this.store.dispatch(getDepartmentsAction());
    this.store.dispatch(getCitiesAction());
    this.store.dispatch(getPrintersAction());
    this.store.dispatch(getDocumentTypesAction());
    this.store.dispatch(getRolesAction());
    this.store.dispatch(getPersonnelPositionAction());
    this.store.dispatch(getPersonnelAction());
    this.store.dispatch(getShiftsConfigAction());
    this.store.dispatch(getPumpsAction());
    this.store.dispatch(getAnalysisTypesAction());
    this.store.dispatch(getSampleTypesAction());
    this.store.dispatch(getSuppliersAction());
    this.store.dispatch(getVehicleTypesAction());
    this.store.dispatch(getMaterialTypesAction());
    this.store.dispatch(getStorageZonesAction());
    this.store.dispatch(getDriversAction());
    this.store.dispatch(getVehiclesAction());
    this.store.dispatch(getMillsAction());
    this.store.dispatch(getBigBagTypesAction());
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
    }
  }

  hideMenu() {
    this.layoutService.layoutState.update((prev: any) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false
    }));
    this.layoutService.reset();
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }

    if (this.menuScrollListener) {
      this.menuScrollListener();
      this.menuScrollListener = null;
    }

    this.unblockBodyScroll();
  }

  containerClass = computed(() => {
    const layoutConfig = this.layoutService.layoutConfig();
    const layoutState = this.layoutService.layoutState();

    return {
      'layout-overlay': layoutConfig.menuMode === 'overlay',
      'layout-static': layoutConfig.menuMode === 'static',
      'layout-slim': layoutConfig.menuMode === 'slim',
      'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
      'layout-horizontal': layoutConfig.menuMode === 'horizontal',
      'layout-reveal': layoutConfig.menuMode === 'reveal',
      'layout-drawer': layoutConfig.menuMode === 'drawer',
      'layout-sidebar-dark': layoutConfig.darkTheme,
      'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
      'layout-overlay-active': layoutState.overlayMenuActive,
      'layout-mobile-active': layoutState.staticMenuMobileActive,
      'layout-topbar-menu-active': layoutState.topbarMenuActive,
      'layout-menu-profile-active': layoutState.rightMenuActive,
      'layout-sidebar-active': layoutState.sidebarActive,
      'layout-sidebar-anchored': layoutState.anchored,
      [`layout-topbar-${layoutConfig.topbarTheme}`]: true,
      [`layout-menu-${layoutConfig.menuTheme}`]: true,
      [`layout-menu-profile-${layoutConfig.menuProfilePosition}`]: true
    };
  });

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
