import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ISupplierOrderEntity } from '@/domain/entities/suppliers/admin/weighing-orders/supplier-order.entity';
import { ICONS } from '@/shared/enums/general.enum';

@Component({
  selector: 'svi-order-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  order = input.required<ISupplierOrderEntity>();
  closeModal = output<void>();

  readonly ICONS = ICONS;

  get statusLabel(): string {
    const labelMap: Record<string, string> = {
      CREADO: 'Creado',
      PENDIENTE: 'Pendiente',
      PROCESO: 'En proceso',
      COMPLETADO: 'Completado',
      CANCELADO: 'Cancelado'
    };
    return labelMap[this.order().status] ?? this.order().status;
  }

  get statusClass(): string {
    const classMap: Record<string, string> = {
      CREADO: 'bg-blue-100 text-blue-800',
      PENDIENTE: 'bg-gray-100 text-gray-800',
      PROCESO: 'bg-yellow-100 text-yellow-800',
      COMPLETADO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800'
    };
    return classMap[this.order().status] ?? 'bg-gray-100 text-gray-800';
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
