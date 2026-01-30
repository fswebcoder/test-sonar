import { Component, input, OnInit, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { EWeightUnits } from "@/shared/enums/weight-units.enum";
import { ERROR_DEFS } from "@/shared/components/form/error-def";
import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { ButtonComponent } from "@/shared/components/form/button/button.component";
import { ICONS } from "@/shared/enums/general.enum";
import { InputNumberComponent } from "@/shared/components/form/input-number/input-number.component";
import { IBigBagTypeEntity } from "@/domain/entities/common/big-bag-type.entity";
import { IFillBigBagParamsEntity } from "@/domain/entities/plant/drying/fill-big-bag-params.entity";

@Component({
    selector: 'svi-fill-big-bag-form',
    templateUrl: './fill-big-bag-form.component.html',
    imports: [ReactiveFormsModule, FloatSelectComponent, FloatInputComponent, DatePikerComponent, ButtonComponent, InputNumberComponent]
})
export class FillBigBagFormComponent implements OnInit {
    form!: FormGroup;
    EWeightUnits = EWeightUnits
    errorMessages = ERROR_DEFS
    bigBagErrorMessages = ERROR_DEFS['bigBagWeight']
    ICONS = ICONS

    onCancel = output<void>();
    onFill = output<IFillBigBagParamsEntity>();

    bigBagTypes = input.required<IBigBagTypeEntity[]>();
    //TODO: Uncomment when mines catalog is available
    mines = input.required<any[]>();

    ngOnInit(): void {
        this.createForm();
    }

    submit() {
        if(!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        const params: IFillBigBagParamsEntity = {
            bigBagTypeId: this.form.value.bigBagTypeId,
            mineId: this.form.value.mineId,
            expectedTime: new Date(this.form.value.expectedTime).toISOString(),
            filledWeight: this.form.value.filledWeight,
            sealSecurity: this.form.value.sealSecurity.toString(),
        }

        this.onFill.emit(params);
    }

    cancel() {
        this.resetForm();
        this.onCancel.emit();
    }

    resetForm() {
        this.form.reset();
    }

    private createForm() {
        this.form = new FormGroup({
            bigBagTypeId: new FormControl(null, [Validators.required]),
            mineId: new FormControl(null, [Validators.required]),
            expectedTime: new FormControl(null, [Validators.required]),
            filledWeight: new FormControl(null, [Validators.required, Validators.max(1001), Validators.min(900)]),
            sealSecurity: new FormControl(null, [Validators.required]),
        });
    }
}