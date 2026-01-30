import { Component, input, output } from '@angular/core';
import { ISendingOrderEntity } from '@/domain/entities/plant/drying/sending-order.entity';
import { IListBigBagSendingOrderParamsEntity } from '@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity';
import { TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { PaginatorComponent } from '@/shared/components/paginator/paginator.component';
import { EmptyStateComponent } from '@/shared/components/empty-state/empty-state.component';
import { OrderManagementFiltersComponent } from '../order-management-filters/order-management-filters.component';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EDryingActions } from '@/presentation/modules/plant/modules/actions.enum';
import { PermissionDirective } from '@/core/directives';

@Component({
  selector: 'svi-bb-order-management-orders-section',
  standalone: true,
  imports: [
    TableComponent,
    PaginatorComponent,
    EmptyStateComponent,
    OrderManagementFiltersComponent,
    ButtonComponent,
    PermissionDirective
  ],
  templateUrl: './order-management-orders-section.component.html'
})
export class OrderManagementOrdersSectionComponent {
  data = input.required<ISendingOrderEntity[]>();
  totalRecords = input.required<number>();
  isModalOpen = input<boolean>(false);

  filtersChange = output<IListBigBagSendingOrderParamsEntity>();
  pageChange = output<void>();
  openCreateOrderModal = output<void>();

  readonly ICONS = ICONS;
  readonly Actions = EDryingActions;
  readonly path = '/planta/gestion-ordenes';

  readonly columns: TableColumn[] = [
    { field: 'consecutive', header: 'Consecutivo' },
    { field: 'status', header: 'Estado' },
    { field: 'createdAt', header: 'Fecha de creación', type: 'date' },
  ];

  onFiltersChange(filters: IListBigBagSendingOrderParamsEntity) {
    this.filtersChange.emit(filters);
  }

  onPageChange() {
    this.pageChange.emit();
  }

  openModal() {
    this.openCreateOrderModal.emit();
  }
}
