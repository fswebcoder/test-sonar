import { NgModule } from '@angular/core';

import { SviStepDirective } from './svi-step.directive';
import { SviStepperComponent } from './svi-stepper.component';

/** Convenience module so consumers can import a single symbol. */
@NgModule({
    imports: [SviStepperComponent, SviStepDirective],
    exports: [SviStepperComponent, SviStepDirective]
})
export class SviStepperModule {}
