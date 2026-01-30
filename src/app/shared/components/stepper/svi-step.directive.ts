import { Directive, Input, TemplateRef, booleanAttribute } from '@angular/core';

export type SviStepperActivateCallback = (value: number) => void;

export interface SviStepperStepContext {
    panelValue: number;

    currentValue: number | undefined;

    active: boolean;

    index: number;

    total: number;

    label: string;


    activate: SviStepperActivateCallback;

    prevValue: number | null;
    nextValue: number | null;
}

@Directive({
    selector: 'ng-template[sviStep]',
    standalone: true
})
export class SviStepDirective {
    @Input('sviStep')
    set legacyTitle(value: string) {
        if (value != null && value !== '') {
            this.title = value;
        }
    }

        @Input({ alias: 'sviStepValue' }) value?: number;

        @Input({ alias: 'sviStepTitle' }) title: string = '';

    @Input({ transform: booleanAttribute }) disabled = false;

    constructor(public readonly templateRef: TemplateRef<any>) {}
}
