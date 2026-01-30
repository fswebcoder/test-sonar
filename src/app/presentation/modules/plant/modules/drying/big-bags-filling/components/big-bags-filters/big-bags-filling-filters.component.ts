import { Component, DestroyRef, inject, input, output, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FloatSelectComponent } from "@/shared/components/form/float-select/float-select.component";
import { FloatInputComponent } from "@/shared/components/form/float-input/float-input.component";
import { FloatMultiselectComponent } from "@/shared/components/form/multiselect/multiselect.component";
import { DatePikerComponent } from "@/shared/components/form/date-piker/date-piker.component";
import { IListBigBagsParamsEntity } from "@/domain/entities/plant/drying/list-big-bags-params.entity";
import { EBigBagStatus } from "@/shared/enums/big-bag-status.enum";
import { formatDate } from "@/core/utils/format-date";
import { debounceTime, distinctUntilChanged } from "rxjs";

export type BigBagFiltersForm = {
    mineId: FormControl<string | null>;
    date: FormControl<Date | null>;
    search: FormControl<string>;
    status: FormControl<EBigBagStatus[]>;
};

@Component({
    selector: "svi-big-bags-filling-filters",
    templateUrl: "./big-bags-filling-filters.component.html",
    styleUrl: "./big-bags-filling-filters.component.scss",
    imports: [
        ReactiveFormsModule,
        FloatSelectComponent,
        FloatInputComponent,
        FloatMultiselectComponent,
        DatePikerComponent
    ]
})
export class BigBagsFillingFiltersComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    mines = input.required<any[] | null>();
    filtersChange = output<IListBigBagsParamsEntity>();


    readonly statusOptions = Object.values(EBigBagStatus).map((value) => ({
        label: value,
        value
    }));

    readonly filtersForm = new FormGroup<BigBagFiltersForm>({
        mineId: new FormControl<string | null>(null),
        date: new FormControl<Date | null>(null),
        search: new FormControl<string>("", { nonNullable: true, validators: [Validators.maxLength(100)] }),
        status: new FormControl<EBigBagStatus[]>([], { nonNullable: true })
    });

    constructor() {}

    ngOnInit(): void {
        this.emitFilters();
        this.setupControlListeners();
    }

    get mineOptions() {
        return this.mines() ?? [];
    }

    resetFilters() {
        this.filtersForm.reset({
            mineId: null,
            date: null,
            search: "",
            status: [] as EBigBagStatus[]
        });
        this.emitFilters();
    }

    private emitFilters() {
        const { mineId, date, search, status } = this.filtersForm.getRawValue();
        this.filtersChange.emit({
            mineId: mineId || undefined,
            date: date ? formatDate(date, false) : undefined,
            search: search?.trim() ? search.trim() : undefined,
            status: status && status.length ? status : undefined
        });
    }

    private setupControlListeners() {
        const { mineId, date, search, status } = this.filtersForm.controls;

        mineId.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.emitFilters());

        date.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.emitFilters());

        status.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.emitFilters());

        search.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.emitFilters());
    }

}
