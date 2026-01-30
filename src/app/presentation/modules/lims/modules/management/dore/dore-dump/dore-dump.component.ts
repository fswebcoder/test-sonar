import { Component, computed, DestroyRef, effect, inject, input, output } from '@angular/core';
import { PaginatorComponent } from "@shared/components/paginator/paginator.component";
import { DatePikerComponent } from "@shared/components/form/date-piker/date-piker.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDoreParamsEntity } from '@/domain/entities/lims/management/dore-params.entity';
import { PaginationService } from '@/shared/services/pagination.service';
import { formatDate } from '@/core/utils/format-date';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getActualMonthRange } from '@/core/utils/get-actual-month-range';
import { IDoreListResponseEntity } from '@/domain/entities/lims/management/dore-list.response';
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { DoreCardComponent } from "../components/dore-card/dore-card.component";
import { IDoreDropdownEntity } from '@/domain/entities/lims/management/dore-dropdown-entity';
import { FloatMultiselectComponent } from "@shared/components/form/multiselect/multiselect.component";

@Component({
  selector: 'svi-dore-dump',
  imports: [PaginatorComponent, DatePikerComponent, ReactiveFormsModule, EmptyStateComponent, DoreCardComponent, FloatMultiselectComponent],
  templateUrl: './dore-dump.component.html',
  styleUrl: './dore-dump.component.scss'
})
export class DoreDumpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);

  data = input<IDoreListResponseEntity[]>();
  meta = input<any>();
  dropdownData = input<IDoreDropdownEntity>();

  suppliers = computed(() => this.dropdownData()?.suppliers);
  doreDropdown = computed(() => this.dropdownData()?.dore);
  batchNumbers = computed(() => this.dropdownData()?.batchNumbers);

  onParamsChange = output<IDoreParamsEntity>();
  onPageChange = output<number>();
  
  form!: FormGroup;

  paginatorEffect = effect(() => {
    const paginationParams = this.paginationService.getPaginationParams();
    this.onParamsChange.emit({
      ...paginationParams,
      startDate: formatDate(this.form.get('startDate')?.value),
      endDate: formatDate(this.form.get('endDate')?.value)
    });  });

  ngOnInit(): void {
    this.createForm();
    this.onParamsChange.emit(this.getPaginationParams());
    this.listenInitialDate();
    this.listenLastDate();
  }

  listenInitialDate() {
    this.form.get('startDate')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.onParamsChange.emit({
        ...this.paginationService.getPaginationParams(),
        startDate: formatDate(value),
        endDate: formatDate(this.form.get('endDate')?.value),
        page: 1
      });
    });
  }
  
  listenLastDate() {
    this.form.get('endDate')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.onParamsChange.emit({
        ...this.paginationService.getPaginationParams(),
        startDate: formatDate(this.form.get('startDate')?.value),
        endDate: formatDate(value),
        page: 1
      });
    });
  }

  createForm() {
    const { startDate, endDate } = getActualMonthRange();
    this.form = this.fb.group({
      startDate: [startDate],
      endDate: [endDate]
    });
  }

  getPaginationParams() {
    return {
      ...this.paginationService.getPaginationParams(),
      startDate: formatDate(this.form.get('startDate')?.value),
      endDate: formatDate(this.form.get('endDate')?.value),
    };
  }
}
