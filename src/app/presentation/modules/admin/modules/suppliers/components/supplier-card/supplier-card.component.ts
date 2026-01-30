import { ISuppliersEntity } from '@/domain/entities/admin/suppliers/suppliers.entity';
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ActionButtonComponent } from '@/shared/components/action-button/action-button.component';
import { ButtonModule } from 'primeng/button';
import { MetricItemComponent } from '@/shared/components/metric-item/metric-item.component';
import { PermissionDirective } from '@/core/directives';

@Component({
  selector: 'svi-supplier-card',
  imports: [CommonModule, PanelModule, ActionButtonComponent, ButtonModule, MetricItemComponent, PermissionDirective],
  templateUrl: './supplier-card.component.html',
  styleUrl: './supplier-card.component.scss'
})
export class SupplierCardComponent {
  supplier = input.required<any>();
  
  viewSupplier = output<any>();
  editSupplier = output<ISuppliersEntity>();
  deleteSupplier = output<ISuppliersEntity>();
  toggleStatus = output<ISuppliersEntity>();
  createAdminUser = output<any>();

  onView(item: string) {
    this.viewSupplier.emit(item);
  }

  onEdit() {
    this.editSupplier.emit(this.supplier());
  }

  onDelete() {
    this.deleteSupplier.emit(this.supplier());
  }

  onToggleStatus() {
    this.toggleStatus.emit(this.supplier());
  }

  onCreateAdminUser(): void {
    this.createAdminUser.emit(this.supplier());
  }
  
  onViewSupplier(item: any) {
    this.viewSupplier.emit(item);
  }

  onEditSupplier(item: any) {
    this.editSupplier.emit(item);
  }

  onDeleteSupplier(item: any) {
    this.deleteSupplier.emit(item);
  }
}
