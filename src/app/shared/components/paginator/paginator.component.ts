import { PaginationService } from '@/shared/services/pagination.service';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'svi-paginator',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  private readonly paginationService = inject(PaginationService);

  @Input() totalRecords: number = 0;
  @Input() rowsPerPageOptions: number[] = [9, 18, 36, 42];
  @Input() showCurrentPageReport: boolean = true;
  @Input() currentPageReportTemplate: string = 'Mostrando {first} a {last} de {totalRecords} registros';
  @Input() showFirstLastIcon: boolean = true;
  @Input() showPageLinks: boolean = true;
  @Input() showJumpToPageDropdown: boolean = false;
  @Input() alwaysShow: boolean = true;
  @Input() templateLeft: TemplateRef<PaginatorState> | undefined;
  @Input() templateRight: TemplateRef<PaginatorState> | undefined;

  @Output() pageChange = new EventEmitter<PaginatorState>();

  onPageChange(event: PaginatorState): void {
    this.paginationService.updatePagination(event);
    this.pageChange.emit(event);
  }

  get pageSize() {
    return this.paginationService.pageSize();
  }

  get first() {
    return this.paginationService.paginationState().first;
  }
}
