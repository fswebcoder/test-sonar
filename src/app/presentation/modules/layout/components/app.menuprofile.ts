import {Component, computed, effect, ElementRef, inject, OnDestroy, Renderer2, signal, viewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Subscription} from "rxjs";
import { Store } from '@ngrx/store';
import { LayoutService } from '../service/layout.service';
import { AuthUseCase } from '@/domain/use-cases/auth/auth.usecase';
import { LogoutService } from '@/shared/services/logout.service';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ACCEPT_LABEL_QUESTION_LOGOUT } from '@/shared/constants/general.contant';
import { logoutAction } from '@/store/actions/auth/auth.actions';
import { ToastCustomService } from '@SV-Development/utilities';

@Component({
    selector: '[app-menu-profile]',
    standalone: true,
    imports: [CommonModule, TooltipModule, ButtonModule, RouterModule, ConfirmDialogComponent],
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
  
    <button (click)="toggleMenu()" pTooltip="Profile" [tooltipDisabled]="isTooltipDisabled()">
            <i class="fa-duotone fa-solid fa-address-card fa-2x"></i>
            <span class="text-start">
                <strong>{{ userName() }}</strong>
                <small>{{ userEmail() }}</small>
            </span>
            <i class="layout-menu-profile-toggler pi pi-fw" [ngClass]="{ 'pi-angle-down': menuProfilePosition() === 'start' || isHorizontal(), 'pi-angle-up': menuProfilePosition() === 'end' && !isHorizontal() }"></i>
        </button>

        <ul *ngIf="menuProfileActive()" [@menu]="isHorizontal() ? 'overlay' : 'inline'">
            <!-- <li pTooltip="Settings" [tooltipDisabled]="isTooltipDisabled()" [routerLink]="['/profile/create']">
                <button [routerLink]="['/documentation']">
                    <i class="pi pi-cog pi-fw"></i>
                    <span>Settings</span>
                </button>
            </li> -->
            <li pTooltip="Cerrar sesión" [tooltipDisabled]="isTooltipDisabled()">
                <button class="p-link text-center" (click)="logout()">
                    <i class="fa-duotone fa-regular fa-right-from-bracket"></i>
                    <span>Cerrar sesión</span>
                </button>
            </li>
            <!-- <li pTooltip="Profile" [tooltipDisabled]="isTooltipDisabled()">
                <button [routerLink]="['/documentation']">
                    <i class="pi pi-file-o pi-fw"></i>
                    <span>Profile</span>
                </button>
            </li>
            <li pTooltip="Support" [tooltipDisabled]="isTooltipDisabled()">
                <button [routerLink]="['/documentation']">
                    <i class="pi pi-compass pi-fw"></i>
                    <span>Support</span>
                </button>
            </li>
            <li pTooltip="Logout" [tooltipDisabled]="isTooltipDisabled()" [routerLink]="['/auth/login2']">
                <button class="p-link">
                    <i class="pi pi-power-off pi-fw"></i>
                    <span>Logout</span>
                </button>
            </li> -->
        </ul>
       
       
        `
        
        ,
    animations: [
        trigger('menu', [
            transition('void => inline', [
                style({ height: 0 }), 
                animate('300ms ease-out', style({ opacity: 1, height: '*' }))
            ]),
            transition('inline => void', [
                animate('250ms ease-in', style({ opacity: 0, height: '0' }))
            ]),
            transition('void => overlay', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }), 
                animate('150ms ease-out')
            ]),
            transition('overlay => void', [
                animate('100ms ease-in', style({ opacity: 0 }))
            ])
        ])
    ],
    host: {
        class: 'layout-menu-profile'
    }
})
export class AppMenuProfile implements OnDestroy {
    viewChildDialog = viewChild<ConfirmDialogComponent>('confirmDialog');
    toastCustomService = inject(ToastCustomService);
    openModal = inject(LogoutService)
    layoutService = inject(LayoutService);
    authUseCase = inject(AuthUseCase);
    renderer = inject(Renderer2);
    router = inject(Router);
    el = inject(ElementRef);
    store = inject(Store);

    isHorizontal = computed(() => this.layoutService.isHorizontal() && this.layoutService.isDesktop());

    menuProfileActive = computed(() => this.layoutService.layoutState().menuProfileActive);

    menuProfilePosition = computed(() => this.layoutService.layoutConfig().menuProfilePosition);

    isTooltipDisabled = computed(() => !this.layoutService.isSlim());

    dialogVisible = signal(false);

    subscription!: Subscription;

    outsideClickListener: any;
    localUser = localStorage.getItem('app-state');
    userName = computed(() => this.localUser ? JSON.parse(this.localUser).auth.name : '');
    userEmail = computed(() => this.localUser ? JSON.parse(this.localUser).auth.email : '');

    constructor() {
        this.subscription = this.layoutService.overlayOpen$.subscribe(() => {
            if(this.isHorizontal() && this.menuProfileActive()) {
                this.layoutService.layoutState.update(value => ({...value, menuProfileActive: false}))
            }
        })

        effect(() => {
            if(this.isHorizontal() && this.menuProfileActive() && !this.outsideClickListener) {
                this.bindOutsideClickListener();
            }

            if(!this.menuProfileActive() && this.isHorizontal()) {
                this.unbindOutsideClickListener();
            }
        })
    }

    bindOutsideClickListener() {
        if(this.isHorizontal()) {
            this.outsideClickListener = this.renderer.listen(document, 'click', (event: MouseEvent) => {
                if(this.menuProfileActive()) {
                    const isOutsideClicked = !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target))
                    if(isOutsideClicked) {
                        this.layoutService.layoutState.update(value => ({...value, menuProfileActive: false}))
                    }
                }
            })
        }
    }

    unbindOutsideClickListener() {
        if(this.outsideClickListener) {
            this.outsideClickListener();
            this.outsideClickListener = null;
        }
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
        this.unbindOutsideClickListener();
    }

    toggleMenu() {
        this.layoutService.onMenuProfileToggle();
    }

    logout() {
        this.viewChildDialog()?.show(
            ACCEPT_LABEL_QUESTION_LOGOUT,
            () => {
                this.store.dispatch(logoutAction());
            },
            () => {}
        );
    }
}
