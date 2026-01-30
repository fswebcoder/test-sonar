import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    OnDestroy,
    Output,
    QueryList,
    computed,
    effect,
    input,
    model,
    signal
} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { Subscription } from 'rxjs';

import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { SviStepDirective, SviStepperStepContext } from './svi-step.directive';

export interface SviStepperStep {
    value: number;
    title: string;
    disabled?: boolean;
}

type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast' | null;

interface SviInternalStep {
    value: number;
    title: string;
    disabled: boolean;
    templateRef?: SviStepDirective['templateRef'];
}

@Component({
    selector: 'svi-stepper',
    standalone: true,
    imports: [CommonModule, StepperModule, ButtonComponent],
    templateUrl: './svi-stepper.component.html',
    styleUrl: './svi-stepper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SviStepperComponent implements AfterContentInit, OnDestroy {
    value = model<number | undefined>(undefined);

    linear = input(false);

    transitionOptions = input('400ms cubic-bezier(0.86, 0, 0.07, 1)');

    steps = input<SviStepperStep[]>([]);

    showBackButton = input(true);
    showNextButton = input(true);
    showFinishButton = input(true);

    backDisabled = input(false);

    nextDisabled = input(false);

    backLabel = input('Atrás');
    nextLabel = input('Siguiente');
    finishLabel = input('Finalizar');

    backIcon = input<string | undefined>(undefined);
    nextIcon = input<string | undefined>(undefined);
    finishIcon = input<string | undefined>(undefined);

    finishLoadingId = input<string | undefined>(undefined);

    backSeverity = input<ButtonSeverity>('secondary');
    nextSeverity = input<ButtonSeverity>('primary');
    finishSeverity = input<ButtonSeverity>('primary');

    finishDisabled = input(false);

    @Output() backClick = new EventEmitter<number | undefined>();
    @Output() nextClick = new EventEmitter<number | undefined>();
    @Output() finishClick = new EventEmitter<void>();

    @ContentChildren(SviStepDirective)
    private readonly stepTemplates?: QueryList<SviStepDirective>;

    private readonly _internalSteps = signal<SviInternalStep[]>([]);
    private _sub?: Subscription;
    private readonly _stepsEffect = effect(() => {
        this.steps();
        this.syncSteps();
    });

    readonly internalSteps = computed(() => this._internalSteps());

    readonly activeIndex = computed(() => {
        const current = this.value();
        if (current == null) return -1;
        return this._internalSteps().findIndex((s) => s.value === current);
    });

    readonly isLastActive = computed(() => {
        const idx = this.activeIndex();
        const steps = this._internalSteps();
        return idx >= 0 && idx === steps.length - 1;
    });

    readonly prevEnabledValue = computed(() => {
        const idx = this.activeIndex();
        const steps = this._internalSteps();
        for (let i = idx - 1; i >= 0; i--) {
            if (!steps[i].disabled) return steps[i].value;
        }
        return null;
    });

    readonly nextEnabledValue = computed(() => {
        const idx = this.activeIndex();
        const steps = this._internalSteps();
        for (let i = idx + 1; i < steps.length; i++) {
            if (!steps[i].disabled) return steps[i].value;
        }
        return null;
    });

    readonly canGoBack = computed(() => this.prevEnabledValue() != null);
    readonly canGoNext = computed(() => this.nextEnabledValue() != null);

    ngAfterContentInit(): void {
        this.syncSteps();

        const changes$ = this.stepTemplates?.changes;
        if (changes$) {
            this._sub = changes$.subscribe(() => this.syncSteps());
        }
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    buildContext(base: Omit<SviStepperStepContext, 'currentValue' | 'prevValue' | 'nextValue'>): SviStepperStepContext {
        const steps = this._internalSteps();

        let prevValue: number | null = null;
        for (let i = base.index - 1; i >= 0; i--) {
            if (!steps[i]?.disabled) {
                prevValue = steps[i].value;
                break;
            }
        }

        let nextValue: number | null = null;
        for (let i = base.index + 1; i < base.total; i++) {
            if (!steps[i]?.disabled) {
                nextValue = steps[i].value;
                break;
            }
        }

        return {
            ...base,
            currentValue: this.value(),
            prevValue,
            nextValue
        };
    }

    onBack(): void {
        const target = this.prevEnabledValue();
        if (target == null) return;
        this.value.set(target);
        this.backClick.emit(this.value());
    }

    onNext(): void {
        const target = this.nextEnabledValue();
        if (target == null) return;
        this.value.set(target);
        this.nextClick.emit(this.value());
    }

    onFinish(): void {
        if (!this.isLastActive() || this.finishDisabled()) return;
        this.finishClick.emit();
    }

    private syncSteps(): void {
        const templates = this.stepTemplates?.toArray() ?? [];

        const templateByValue = new Map<number, SviStepDirective>();
        for (const t of templates) {
            if (typeof t.value === 'number') {
                templateByValue.set(t.value, t);
            }
        }

        const stepDefs = this.steps() ?? [];
        const steps: SviInternalStep[] = stepDefs
            .filter((s) => typeof s?.value === 'number')
            .map((s) => {
                const tpl = templateByValue.get(s.value);
                return {
                    value: s.value,
                    title: s.title,
                    disabled: Boolean(s.disabled) || Boolean(tpl?.disabled),
                    templateRef: tpl?.templateRef
                };
            });

        this._internalSteps.set(steps);

        if (!steps.length) {
            this.value.set(undefined);
            return;
        }

        const allowedValues = new Set(steps.map((s) => s.value));
        const current = this.value();
        if (current == null || !allowedValues.has(current)) {
            const firstEnabled = steps.find((s) => !s.disabled)?.value ?? steps[0].value;
            this.value.set(firstEnabled);
        }
    }
}
