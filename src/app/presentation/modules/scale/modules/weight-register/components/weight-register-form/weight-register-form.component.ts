import { WeightRegisterUsecase } from "@/domain/use-cases/scale/weight-register/weight-register.usecase";
import { IWeightReadingEntity } from "@/domain/entities/scale/weight-register/weight-reading.entity";
import { Component, DestroyRef, OnDestroy, computed, effect, inject, input, output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { catchError, EMPTY, finalize, Subscription, take } from "rxjs";
import { ICONS } from "@/shared/enums/general.enum";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { CountUpModule } from "ngx-countup";
import { CountUpOptions } from "countup.js";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { LoadingService } from "@/shared/services/loading.service";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { ToastCustomService } from '@SV-Development/utilities';
@Component({
    selector: "svi-weight-register-form",
    standalone: true,
    templateUrl: "./weight-register-form.component.html",
    styleUrl: "./weight-register-form.component.scss",
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, FloatSelectComponent, CountUpModule, LoadingComponent, FloatInputComponent],
})
export class WeightRegisterFormComponent implements OnDestroy {
    private readonly weightRegisterUsecase = inject(WeightRegisterUsecase);
    private readonly destroyRef = inject(DestroyRef);
    readonly loadingService = inject(LoadingService);
    private readonly toastService = inject(ToastCustomService);

    private weightSubscription?: Subscription;
    private weightWatchdogId?: ReturnType<typeof globalThis.setInterval>;

    private readonly WATCHDOG_TIMEOUT_MS = 7000;
    private readonly WATCHDOG_INTERVAL_MS = 500;

    private readonly MANUAL_REASON_SOCKET_ERROR = "No fue posible leer el peso. Modo manual habilitado.";
    private readonly MANUAL_REASON_SOCKET_TIMEOUT = "Sin lectura de la báscula por 7s. Modo manual habilitado.";
    readonly ICONS = ICONS;
    readonly EWeightUnits = EWeightUnits;

    currentWeight = signal<number>(0);
    manualMode = signal<boolean>(false);
    manualModeReason = signal<string | null>(null);
    readonly manualWeightControl = new FormControl<number | null>(null);
    private readonly manualWeightValue = signal<number>(0);

    private readonly isCapturingImage = signal<boolean>(false);

    private readonly lastWeightReceivedAt = signal<number | null>(null);
    private readonly zeroWeightSinceAt = signal<number | null>(null);
    private readonly readingStartedAt = signal<number | null>(null);

    capturedWeight = signal<number | null>(null);
    capturedTmpUrl = signal<string | null>(null);
    capturedTmpPath = signal<string | null>(null);
    capturedImageLoaded = signal<boolean>(false);
    captureAttempted = signal<boolean>(false);
    isReading = signal<boolean>(false);

    readonly LOADING = {
        sections: {
            captureImage: "scale-weight-register-capture-image",
        },
    };

    readonly effectiveWeight = computed<number>(() => {
        return this.manualMode() ? this.manualWeightValue() : this.currentWeight();
    });
    readonly countUpOptions: CountUpOptions = {
        separator: ".",
        duration: 2,
    };

    requiresDestinationZone = input<boolean>(false);
    storageZones = input<IIdName[]>([]);

    private readonly destinationStorageZoneId = signal<string | null>(null);

    readonly form = new FormGroup({
        destinationStorageZoneId: new FormControl<string | null>(null)
    });

    showCapturedImage = computed<boolean>(() => {
        return !this.isReading() && !!this.capturedTmpUrl();
    });

    showCameraUnavailable = computed<boolean>(() => {
        const isCapturing = this.isCapturingImage();
        const hasImage = !!this.capturedTmpUrl();

        return !this.isReading() && !isCapturing && this.captureAttempted() && !hasImage;
    });

    canRegisterWeight = computed<boolean>(() => {
        const weight = this.effectiveWeight();

        const destinationValue = this.destinationStorageZoneId();
        const destinationOk = !this.requiresDestinationZone() || destinationValue !== null;
        const isCapturing = this.isCapturingImage();

        const hasImage = !!this.capturedTmpUrl();
        const imageOk = hasImage || this.captureAttempted();

        return weight > 0 && destinationOk && !isCapturing && !this.isReading() && imageOk;
    });

    registerWeight = output<Omit<IWeightRegisterParams, "id">>();

    constructor() {
        this.manualWeightControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                const numeric = typeof value === "number" ? value : Number(value);
                this.manualWeightValue.set(Number.isFinite(numeric) ? numeric : 0);
            });

        this.destinationStorageZoneId.set(this.form.controls.destinationStorageZoneId.value);
        this.form.controls.destinationStorageZoneId.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                this.destinationStorageZoneId.set(value);
            });

        effect(() => {
            if (this.requiresDestinationZone()) {
                this.form.controls.destinationStorageZoneId.setValidators([Validators.required]);
            } else {
                this.form.controls.destinationStorageZoneId.clearValidators();
                this.form.controls.destinationStorageZoneId.setValue(null, { emitEvent: false });
                this.destinationStorageZoneId.set(null);
            }

            this.form.controls.destinationStorageZoneId.updateValueAndValidity({ emitEvent: false });
        });
    }

    connectToScale(): void {
        this.weightRegisterUsecase.connectToScaleSocket();
    }

    disconnectFromScale(): void {
        this.weightRegisterUsecase.disconnectScaleSocket();
    }

    startReadingWeight(): void {
        if (this.isReading()) {
            return;
        }

        this.manualMode.set(false);
        this.manualModeReason.set(null);
        this.manualWeightControl.setValue(null, { emitEvent: false });
        this.manualWeightValue.set(0);
        this.resetReadingTracking(Date.now());

        this.capturedTmpUrl.set(null);
        this.capturedTmpPath.set(null);
        this.capturedImageLoaded.set(false);
        this.captureAttempted.set(false);
        this.loadingService.stopLoading(this.LOADING.sections.captureImage);
        this.isCapturingImage.set(false);

        this.connectToScale();
        this.listenWeight();
        this.startWeightWatchdog();
        this.weightRegisterUsecase.startScale();
        this.isReading.set(true);
    }

    stopReadingWeight(): void {
        if (this.manualMode()) {
            return;
        }

        if (!this.isReading()) {
            return;
        }

        this.capturedWeight.set(this.formatWeight(this.currentWeight()));

        this.weightRegisterUsecase.stopScale();
        this.weightSubscription?.unsubscribe();
        this.weightSubscription = undefined;
        this.disconnectFromScale();
        this.isReading.set(false);
        this.stopWeightWatchdog();
        this.readingStartedAt.set(null);

        this.captureImage();
    }

    captureImageManually(): void {
        if (this.loadingService.isLoadingSync(this.LOADING.sections.captureImage)) {
            return;
        }

        this.captureImage();
    }

    onCapturedImageLoad(): void {
        this.capturedImageLoaded.set(true);
    }

    onCapturedImageError(): void {
        this.capturedImageLoaded.set(false);
        this.capturedTmpUrl.set(null);
        this.capturedTmpPath.set(null);
    }

    ngOnDestroy(): void {
        this.weightSubscription?.unsubscribe();
        this.stopWeightWatchdog();
    }

    submitWeight(): void {
        const weight = this.formatWeight(this.effectiveWeight());
        const imageUrl = this.capturedTmpUrl() ?? null;
        const imageTmpPath = this.capturedTmpPath() ?? null;

        const destinationStorageZoneId = this.requiresDestinationZone()
            ? (this.form.controls.destinationStorageZoneId.value ?? undefined)
            : undefined;

        this.registerWeight.emit({
            weight,
            destinationStorageZoneId,
            imageUrl,
            imageTmpPath,
        });
    }

    clearWeight(): void {
        this.currentWeight.set(0);
        this.stopReadingWeight();
        this.isReading.set(false);
        this.manualMode.set(false);
        this.manualModeReason.set(null);
        this.manualWeightControl.setValue(null, { emitEvent: false });
        this.capturedTmpUrl.set(null);
        this.capturedTmpPath.set(null);
        this.captureAttempted.set(false);
        this.form.controls.destinationStorageZoneId.setValue(null, { emitEvent: false });
        this.destinationStorageZoneId.set(null);
    }

    private captureImage(): void {
        this.captureAttempted.set(true);
        this.capturedImageLoaded.set(false);
        this.capturedTmpUrl.set(null);
        this.capturedTmpPath.set(null);

        this.isCapturingImage.set(true);
        this.loadingService.startLoading(this.LOADING.sections.captureImage);
        this.weightRegisterUsecase
            .captureImage()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                take(1),
                finalize(() => {
                    this.loadingService.stopLoading(this.LOADING.sections.captureImage);
                    this.isCapturingImage.set(false);
                }),
                catchError(() => {
                    this.capturedTmpUrl.set(null);
                    this.capturedTmpPath.set(null);
                    return EMPTY;
                })
            )
            .subscribe(response => {
                const tmpUrl = (response?.data?.tmpUrl ?? "").trim();
                const tmpPath = (response?.data?.tmpPath ?? "").trim();

                this.capturedTmpUrl.set(tmpUrl.length ? tmpUrl : null);
                this.capturedTmpPath.set(tmpPath.length ? tmpPath : null);
            });
    }

    private listenWeight(): void {
        if (this.hasActiveWeightSubscription()) {
            return;
        }
        
        this.weightSubscription = this.weightRegisterUsecase.listenWeight().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: reading => this.onWeightReading(reading),
            error: () => this.enableManualWeight(this.MANUAL_REASON_SOCKET_ERROR)
        });
    }

    private hasActiveWeightSubscription(): boolean {
        return !!this.weightSubscription && !this.weightSubscription.closed;
    }

    private onWeightReading(reading: IWeightReadingEntity): void {
        const now = Date.now();
        const weight = reading.weight;

        this.currentWeight.set(weight);
        this.markWeightReceived(now, weight);
    }

    private resetReadingTracking(now: number): void {
        this.readingStartedAt.set(now);
        this.lastWeightReceivedAt.set(null);
        this.zeroWeightSinceAt.set(null);
    }

    private markWeightReceived(now: number, weight: number): void {
        this.lastWeightReceivedAt.set(now);
        this.updateZeroWeightTracking(now, weight);
    }

    private updateZeroWeightTracking(now: number, weight: number): void {
        if (weight === 0) {
            this.zeroWeightSinceAt.set(this.zeroWeightSinceAt() ?? now);
            return;
        }

        this.zeroWeightSinceAt.set(null);
    }

    private startWeightWatchdog(): void {
        this.stopWeightWatchdog();

        this.weightWatchdogId = globalThis.setInterval(() => this.tickWeightWatchdog(), this.WATCHDOG_INTERVAL_MS);
    }

    private tickWeightWatchdog(): void {
        if (!this.isReading()) {
            return;
        }

        const now = Date.now();
        if (this.shouldFallbackToManual(now)) {
            this.enableManualWeight(this.MANUAL_REASON_SOCKET_TIMEOUT);
        }
    }

    private shouldFallbackToManual(now: number): boolean {
        return this.hasNeverReceivedTooLong(now) || this.hasNoDataTooLong(now) || this.hasZeroTooLong(now);
    }

    private hasNeverReceivedTooLong(now: number): boolean {
        const last = this.lastWeightReceivedAt();
        const startedAt = this.readingStartedAt();

        if (last !== null || startedAt === null) {
            return false;
        }

        return now - startedAt >= this.WATCHDOG_TIMEOUT_MS;
    }

    private hasNoDataTooLong(now: number): boolean {
        const last = this.lastWeightReceivedAt();
        if (last === null) {
            return false;
        }

        return now - last >= this.WATCHDOG_TIMEOUT_MS;
    }

    private hasZeroTooLong(now: number): boolean {
        const zeroSince = this.zeroWeightSinceAt();
        if (zeroSince === null) {
            return false;
        }

        return now - zeroSince >= this.WATCHDOG_TIMEOUT_MS;
    }

    private stopWeightWatchdog(): void {
        if (this.weightWatchdogId != null) {
            clearInterval(this.weightWatchdogId);
            this.weightWatchdogId = undefined;
        }
    }

    private enableManualWeight(reason: string): void {
        if (this.isReading()) {
            this.stopScaleSafely();
            this.cleanupWeightSubscription();
            this.manualWeightControl.setValue(null, { emitEvent: false });
        }

        this.manualMode.set(true);
        this.manualModeReason.set(reason);
        this.toastService.warn("Modo manual activado", "Ingrese el peso manualmente para continuar.");
    }

    private stopScaleSafely(): void {
        try {
            this.weightRegisterUsecase.stopScale();
        } catch {
        }
    }

    private cleanupWeightSubscription(): void {
        this.weightSubscription?.unsubscribe();
        this.weightSubscription = undefined;
        this.disconnectFromScale();
        this.isReading.set(false);
        this.stopWeightWatchdog();
        this.readingStartedAt.set(null);
    }

    formatWeight(weight: number): number {
        return Number.parseFloat(weight.toFixed(3));
    }

}