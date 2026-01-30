import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { IMaterialTypeCatalogEntity } from '@/domain/entities/common/material-type-catalog.entity';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatSelectComponent } from '@/shared/components/form/float-select/float-select.component';
import { LoadingComponent } from '@/shared/components/loading/loading.component';
import { LoadingService } from '@/shared/services/loading.service';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { MINERAL_SEND_LOADING } from '../../mineral-send.loading';
import { DatePikerComponent } from '@/shared/components/form/date-piker/date-piker.component';
import { FileInputComponent } from '@/shared/components/form/file-input/file-input.component';

@Component({
    selector: 'svi-step-general-info',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FloatInputComponent, FloatSelectComponent, LoadingComponent, DatePikerComponent, FileInputComponent],
    templateUrl: './step-general-info.component.html'
})

export class StepGeneralInfoComponent {

    readonly loadingService = inject(LoadingService);
    readonly LOADING = MINERAL_SEND_LOADING;

    mines = input.required<IMineEntity[]>();
    materialTypes = input.required<IMaterialTypeCatalogEntity[]>();
    form = input.required<FormGroup>();
    requiresRemissionDocument = input<boolean>(false);
    minShippingDate = input.required<Date>();

    readonly WeightUnits = EWeightUnits;
}