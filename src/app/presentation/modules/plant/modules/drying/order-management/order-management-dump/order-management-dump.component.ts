import { Component, ViewChild, effect, inject, input, output, signal } from '@angular/core';
import { PaginationService } from '@/shared/services/pagination.service';
import { TPaginationParams } from '@SV-Development/utilities';
import { ISendingOrderEntity } from '@/domain/entities/plant/drying/sending-order.entity';
import { IListBigBagSendingOrderParamsEntity } from '@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity';
import { IBigBagEntity } from '@/domain/entities/plant/drying/big-bag.entity';
import { OrderManagementOrdersSectionComponent } from '../components/order-management-orders-section/order-management-orders-section.component';
import { OrderManagementBigBagsModalComponent } from '../components/order-management-big-bags-modal/order-management-big-bags-modal.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-bb-order-management-dump',
  templateUrl: './order-management-dump.component.html',
  styleUrl: './order-management-dump.component.scss',
  imports: [
    OrderManagementOrdersSectionComponent,
    OrderManagementBigBagsModalComponent,
    ConfirmDialogComponent
  ]
})
export class OrderManagementDumpComponent {
  private readonly paginationService = inject(PaginationService);

  data = input.required<ISendingOrderEntity[]>();
  availableBigBags = input<IBigBagEntity[]>([]);
  availableBigBagsTotalRecords = input<number>(0);
  
  onOrdersParamsChange = output<TPaginationParams>();
  onBigBagsParamsChange = output<TPaginationParams>();
  onFilterChange = output<IListBigBagSendingOrderParamsEntity>();
  onSubmitCreateOrder = output<IBigBagEntity[]>();
  onOpenCreateOrderModal = output<void>();
  
  createOrderModalVisible = signal(false);
  selectedBigBags = signal<IBigBagEntity[]>([]);
  selectedBigBagsMap = signal<Record<string, IBigBagEntity>>({});

  @ViewChild('createOrderConfirmDialog') createOrderConfirmDialog!: ConfirmDialogComponent;

  readonly ICONS = ICONS;

  ordersPageChange() {
    this.onOrdersParamsChange.emit(this.paginationService.getPaginationParams());
  }

  bigBagsPageChange() {
    this.onBigBagsParamsChange.emit(this.paginationService.getPaginationParams());
  }

  onFiltersChange(filters: IListBigBagSendingOrderParamsEntity) {
    this.onFilterChange.emit(filters);
  }

  openCreateOrderModal() {
    this.onOpenCreateOrderModal.emit();
    this.createOrderModalVisible.set(true);
  }

  closeCreateOrderModal() {
    this.createOrderModalVisible.set(false);
  }

  onBigBagsSelectionChange(selected: IBigBagEntity[]) {
    const selectionMap = { ...this.selectedBigBagsMap() };
    const currentPageIds = new Set((this.availableBigBags() ?? []).map(item => item.id));

    currentPageIds.forEach(id => {
      const isStillSelected = selected.some(item => item.id === id);
      if (!isStillSelected) {
        delete selectionMap[id];
      }
    });

    selected.forEach(item => {
      selectionMap[item.id] = item;
    });

    this.selectedBigBagsMap.set(selectionMap);
    this.selectedBigBags.set(Object.values(selectionMap));
  }

  submitCreateOrder() {
    const currentSelection = this.selectedBigBags();
    if (!currentSelection.length) {
      return;
    }

    this.createOrderConfirmDialog.show(
      `¿Deseas crear la orden con ${currentSelection.length} big bags seleccionados?`,
      () => {
        const payload = [...currentSelection];
        this.clearBigBagSelection();
        this.onSubmitCreateOrder.emit(payload);
      },
      () => {}
    );
  }

  changeCreateOrderEffect$ = effect(() => {
    const isVisible = this.createOrderModalVisible();
    if (!isVisible) {
      this.clearBigBagSelection();
    }
    this.paginationService.resetPagination();
  })

  private clearBigBagSelection() {
    this.selectedBigBags.set([]);
    this.selectedBigBagsMap.set({});
  }

  get getTotalRecords() {
    return this.paginationService.getTotalRecords();
  }
 
  get bigBagsTotalRecords() {
    return this.availableBigBagsTotalRecords() ?? this.availableBigBags().length ?? 0;
  }
}
