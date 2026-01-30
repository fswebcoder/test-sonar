import { Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FloatMultiselectComponent } from '@/shared/components/form/multiselect/multiselect.component';
import { DatePikerComponent } from '@/shared/components/form/date-piker/date-piker.component';
import { IListBigBagSendingOrderParamsEntity } from '@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity';
import { EBigBagSendingOrderStatus } from '@/shared/enums/big-bag-sending-order.enum';
import { formatDate } from '@/core/utils/format-date';

export type OrderFiltersForm = {
  date: FormControl<Date | null>;
  search: FormControl<string>;
  status: FormControl<EBigBagSendingOrderStatus[]>;
};

@Component({
  selector: 'svi-order-management-filters',
  templateUrl: './order-management-filters.component.html',
  imports: [ReactiveFormsModule, FloatInputComponent, FloatMultiselectComponent, DatePikerComponent]
})
export class OrderManagementFiltersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  filtersChange = output<IListBigBagSendingOrderParamsEntity>();

  readonly statusOptions = Object.values(EBigBagSendingOrderStatus).map(value => ({
    label: value,
    value
  }));

  readonly filtersForm = new FormGroup<OrderFiltersForm>({
    date: new FormControl<Date | null>(null),
    search: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    status: new FormControl<EBigBagSendingOrderStatus[]>([], { nonNullable: true })
  });

  ngOnInit(): void {
    this.emitFilters();
    this.setupControlListeners();
  }

  resetFilters() {
    this.filtersForm.reset({
      date: null,
      search: '',
      status: [] as EBigBagSendingOrderStatus[]
    });
    this.emitFilters();
  }

  private emitFilters() {
    const { date, search, status } = this.filtersForm.getRawValue();

    this.filtersChange.emit({
      date: date ? formatDate(date, false) : undefined,
      search: search?.trim() ? search.trim() : undefined,
      status: status && status.length ? status : undefined
    });
  }

  private setupControlListeners() {
    const { date, search, status } = this.filtersForm.controls;

    date.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    status.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());
  }
}
