import { IDoreListResponseEntity } from '@/domain/entities/lims/management/dore-list.response';
import { IDoreEntity } from '@/domain/entities/lims/management/dore.entity';
import { TableAction, TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { Component, Input, input, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'svi-dore-card',
  imports: [CardModule, AvatarModule, TooltipModule, PanelModule, TableComponent, CommonModule, ImageModule, ConfirmDialogComponent],
  templateUrl: './dore-card.component.html',
  styleUrl: './dore-card.component.scss'
})
export class DoreCardComponent {
  @Input({required: true}) dore!: IDoreListResponseEntity;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  columns: TableColumn[] = [
    { field: 'code', header: 'Código', sortable: true, width: '150px' },
    { field: 'receivedWeight', header: 'Peso recibido', sortable: true, width: '200px' },
    {
      field: 'status',
      header: 'Estado',
      sortable: true,
      width: '200px',
      template: (item: IDoreEntity) => {
        const status = item.status.name || '';
        const statusClass =
          status.toLowerCase() === 'recibido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        return `<span class="px-2 py-1 rounded-full text-sm font-medium ${statusClass}">${status}</span>`;
      },
      isHtml: true
    },
    {
      field: 'base64',
      header: 'Imagen',
      sortable: false,
      width: '150px',
      type: 'image',
      formatField: 'format'
    }
  ];

  
  actions: TableAction[] = [
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar registro',
      action: (row: any) => this.removeItem(row)
    }
  ];

  removeItem(row: any) {
    this.confirmDialog.show(
      `¿Está seguro que desea eliminar el registro de peso de ${row.receivedWeight}gr?`,
      () => {
      },
      () => {}
    );
  }

}
