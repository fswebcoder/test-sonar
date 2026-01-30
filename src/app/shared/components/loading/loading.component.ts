import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { LoadingOptions } from '../../interfaces/loading-options.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            *ngIf="isLoading"
            class="loading-wrapper"
            [class.overlay]="options?.overlay"
            [class.fullscreen]="isFullscreen"
            [class]="options?.size || 'medium'">

            <div class="loading-content">
                <div *ngIf="options?.type === 'dots'" class="dots-container">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>

                <div *ngIf="options?.type === 'pulse' || !options?.type" class="pulse-container">
                    <div class="pulse-ring"></div>
                    <div class="pulse-core"></div>
                </div>

                <div *ngIf="options?.type === 'wave'" class="wave-container">
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                </div>

                <div *ngIf="options?.type === 'circle'" class="circle-container">
                    <svg class="circle-svg" viewBox="0 0 50 50">
                        <circle class="circle-path" cx="25" cy="25" r="20" fill="none" stroke-width="4"/>
                    </svg>
                </div>

                <div *ngIf="options?.showMessage && options?.message" class="loading-message">
                    {{ options?.message }}
                </div>
            </div>
        </div>
    `,
    styles: [`
        .loading-wrapper {
            --loading-primary: var(--primary-color, #2196F3);
            --loading-secondary: var(--secondary-color, #1976D2);
            --loading-background: var(--surface-ground, #ffffff);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            gap: 1.5rem;

            &.small { min-height: 60px; }
            &.medium { min-height: 100px; }
            &.large { min-height: 150px; }

            &.overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 1000;
                min-height: 100%;
            }

            &.fullscreen {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9999;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;

                .loading-content {
                    transform: translateY(-10%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 2rem;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
            }
        }

        .dots-container {
            display: flex;
            gap: 8px;

            .dot {
                width: 12px;
                height: 12px;
                background: var(--loading-primary);
                border-radius: 50%;
                animation: dots-bounce 0.7s infinite ease-in-out;

                &:nth-child(1) { animation-delay: 0s; }
                &:nth-child(2) { animation-delay: 0.1s; }
                &:nth-child(3) { animation-delay: 0.2s; }
            }
        }

        @keyframes dots-bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
        }

        .pulse-container {
            position: relative;
            width: 50px;
            height: 50px;

            .pulse-core {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                background: var(--loading-primary);
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }

            .pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                border: 3px solid var(--loading-primary);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: pulse 1s ease-out infinite;
            }
        }

        @keyframes pulse {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1.8);
                opacity: 0;
            }
        }

        .wave-container {
            display: flex;
            align-items: center;
            gap: 4px;
            height: 40px;

            .wave-bar {
                width: 4px;
                height: 100%;
                background: var(--loading-primary);
                border-radius: 2px;
                animation: wave 0.6s ease-in-out infinite;

                @for $i from 1 through 5 {
                    &:nth-child(#{$i}) {
                        animation-delay: #{$i * 0.05}s;
                    }
                }
            }
        }

        @keyframes wave {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
        }

        .circle-container {
            width: 50px;
            height: 50px;

            .circle-svg {
                animation: rotate 1s linear infinite;

                .circle-path {
                    stroke: var(--loading-primary);
                    stroke-linecap: round;
                    animation: circle-dash 1s ease-in-out infinite;
                }
            }
        }

        @keyframes rotate {
            100% { transform: rotate(360deg); }
        }

        @keyframes circle-dash {
            0% {
                stroke-dasharray: 1, 150;
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -35;
            }
            100% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -124;
            }
        }

        .loading-message {
            color: var(--text-color);
            font-size: 0.9rem;
            font-weight: 500;
            text-align: center;
            margin-top: 0.5rem;
        }
    `]
})
export class LoadingComponent implements OnInit, OnDestroy {
    @Input() section: string = 'default';
    @Input() options?: LoadingOptions = {
        type: 'pulse',
        size: 'medium',
        showMessage: false,
        overlay: false,
        fullscreen: true 
    };

    get isFullscreen(): boolean {
        return this.options?.fullscreen ?? (this.section === 'default');
    }

    isLoading: boolean = false;
    private loadingSubscription?: Subscription;

    constructor(private loadingService: LoadingService) {}

    ngOnInit() {
        this.isLoading = this.loadingService.isLoadingSync(this.section);
        this.loadingSubscription = this.loadingService.isLoading$(this.section).subscribe(
            loading => {
                this.isLoading = loading;
            }
        );
    }

    ngOnDestroy() {
        if (this.loadingSubscription) {
            this.loadingSubscription.unsubscribe();
        }
    }
}
