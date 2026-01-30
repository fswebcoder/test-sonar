import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { IBigBagEntity } from '@/domain/entities/plant/drying/big-bag.entity';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { FloatInputComponent } from '@/shared/components/form/float-input/float-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginationService } from '@/shared/services/pagination.service';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-bb-order-management-big-bags-modal',
  standalone: true,
  imports: [TableComponent, EmptyStateComponent, PaginatorComponent, ButtonComponent, FloatInputComponent, ReactiveFormsModule],
  templateUrl: './order-management-big-bags-modal.component.html'
})
export class OrderManagementBigBagsModalComponent {
  availableBigBags = input.required<IBigBagEntity[]>();
  selectedBigBags = input.required<IBigBagEntity[]>();
  totalRecords = input<number>(0);

  private readonly paginationService = inject(PaginationService);
  private readonly destroyRef = inject(DestroyRef);

  close = output<void>();
  submit = output<void>();
  selectionChange = output<IBigBagEntity[]>();
  pageChange = output<void>();

  form!: FormGroup
  ICONS = ICONS

  readonly columns: TableColumn[] = [
    { field: 'consecutive', header: 'Consecutivo' },
    {field: 'bigBagType', header: 'Tipo de big bag', template(item) {
        return item.bigBagType.name;
    }},
    {field: 'mine', header: 'Mina', template(item) {
        return item.mine.name;
    },},
    { field: 'expectedTime', header: 'Fecha de llenado', type: 'date' },
    { field: 'filledWeight', header: 'Peso llenado' },
    { field: 'status', header: 'Estado' }
  ];

  ngOnInit() {
    this.createForm();
    this.listenSearchChanges();
  }

  onSelectionChange(selected: IBigBagEntity[]) {
    this.selectionChange.emit(selected);
  }

  selectedWeightTotal(): number {
    return this.selectedBigBags().reduce((acc, bag) => acc + Number(bag.filledWeight ?? 0), 0);
  }

  formatWeight(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit();
  }

  onPageChange() {
    this.pageChange.emit();
  }

  private createForm(){
    this.form = new FormGroup({
      search: new FormControl(''),
    });
  }

  private listenSearchChanges() {
    this.form.get('search')?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300)
    ).subscribe(value => {
        this.paginationService.setSearch(value);
        this.pageChange.emit();
    });
    
}
}

