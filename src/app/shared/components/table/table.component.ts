import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ContentChild, TemplateRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PermissionDirective } from '@/core/directives';
import { TSeverityType } from '@/shared/types/severity-type.type';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'actions' | 'badge';
  format?: string;
  formatField?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  template?: (item: any) => string;
  isHtml?: boolean;
  badgeColor?: (value: any) => string;
  badgeSeverity?: (value: any) => 'success' | 'info' | 'warn' | 'danger' | 'secondary';
  badgeText?: (value: any) => string;
  tooltip?: {
    enabled: boolean;
    field?: string;
    maxLength?: number;
    position?: 'top' | 'bottom' | 'left' | 'right';
    customText?: (item: any) => string;
  };
  permission?: {
    path: string;
    action: string;
  }
}

export interface TableAction {
  icon: string;
  tooltip: string;
  action: (row: any) => void;
  severity?: TSeverityType;
  disabled?: (row: any) => boolean;
  permission?: {
    path: string;
    action: string;
  }
}

@Component({
  selector: 'svi-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    TooltipModule,
    RippleModule,
    InputTextModule,
    FormsModule,
    ImageModule,
    BadgeModule,
    PermissionDirective,
    CheckboxModule,
    RadioButtonModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() showPaginator: boolean = true;
  @Input() rowsPerPage: number = 10;
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Input() responsive: boolean = true;
  @Input() selectionMode: 'single' | 'multiple' | null = null;
  private _selectedItems: any[] = [];
  @Input()
  get selectedItems(): any[] {
    return this._selectedItems;
  }
  set selectedItems(value: any[]) {
    this._selectedItems = value ?? [];
  }
  @Input() globalFilter: boolean = false;
  @Input() emptyMessage: string = 'No se encontraron registros';
  @Input() expandableRows: boolean = false;
  @Input() dataKey: string = 'id';
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];

  @Output() selectedItemsChange = new EventEmitter<any[]>();

  @ContentChild('expanded') expandedTemplate?: TemplateRef<any>;

  first: number = 0;
  rows: number = 10;
  globalFilterValue: string = '';
  globalFilterFields: string[] = [];
  isMobileView: boolean = false;
  expandedRows: Set<any> = new Set();

  ngOnInit() {
    this.rows = this.rowsPerPage;
    this.globalFilterFields = this.columns.map(col => col.field);
    this.checkScreenSize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowsPerPage'] && !changes['rowsPerPage'].firstChange) {
      this.rows = this.rowsPerPage;
      this.first = 0;
    }

    if (changes['data']) {
      this.first = Math.min(this.first, Math.max(this.totalRecordCount - this.rows, 0));
      if (!this.showPaginator) {
        this.first = 0;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isMobile(): boolean {
    return this.isMobileView;
  }

  getColumnClass(column: TableColumn): string {
    return `column-${column.field} ${column.align || 'left'}-align`;
  }

  get pagedData(): any[] {
    if (!this.showPaginator) {
      return this.data;
    }
    const start = this.first;
    const end = this.first + this.rows;
    return this.data.slice(start, end);
  }

  get totalRecordCount(): number {
    return this.totalRecords || this.data.length;
  }

  handleSelectionChange(event: any) {
    const selection = Array.isArray(event) ? event : event?.value ?? [];
    this.updateSelection(selection);
  }

  isRowSelected(row: any): boolean {
    const key = this.getRowKey(row);
    return this.selectedItems.some(item => this.getRowKey(item) === key);
  }

  onMobileCheckboxToggle(row: any, checked: boolean) {
    if (checked) {
      if (!this.isRowSelected(row)) {
        this.updateSelection([...this.selectedItems, row]);
      }
    } else {
      this.updateSelection(this.selectedItems.filter(item => this.getRowKey(item) !== this.getRowKey(row)));
    }
  }

  onMobileRadioSelect(row: any) {
    if (!this.isRowSelected(row)) {
      this.updateSelection([row]);
    }
  }

  private updateSelection(selection: any[]) {
    this._selectedItems = selection;
    this.selectedItemsChange.emit(this._selectedItems);
  }

  formatValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) return '';

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleString();
      case 'number':
        return value.toLocaleString();
      case 'boolean':
        return value ? 'Sí' : 'No';
      case 'badge':
        return value.toString();
      default:
        return value.toString();
    }
  }

  getBadgeColor(value: any, column: TableColumn): string {
    if (column.badgeColor) {
      return column.badgeColor(value);
    }
    return 'secondary';
  }

  getBadgeSeverity(value: any, column: TableColumn): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (column.badgeSeverity) {
      return column.badgeSeverity(value);
    }
    return 'secondary';
  }

  getBadgeText(value: any, column: TableColumn): string {
    if (column.badgeText) {
      return column.badgeText(value);
    }
    return this.formatValue(value, column);
  }

  isActionDisabled(action: TableAction, row: any): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  isImageField(value: any, col?: TableColumn, row?: any): boolean {
    if (col?.type === 'image') {
      if (row && col.formatField && row[col.field] && row[col.formatField]) {
        return true;
      }
      if (row && col.format && row[col.field]) {
        return true;
      }
    }
    if (!value) return false;
    if (typeof value === 'object' && value.base64 && value.format) {
      return true;
    }
    if (typeof value === 'string' && value.startsWith('data:image')) {
      return true;
    }
    return false;
  }

  getImageSource(value: any, col?: TableColumn, row?: any): string {
    
    if (col?.type === 'image') {
      if (row && col.formatField && row[col.field] && row[col.formatField]) {
        const base64Value = row[col.field];
        const format = row[col.formatField];
        if (typeof base64Value === 'string' && base64Value.startsWith('data:image')) {
          return base64Value;
        }
        return `data:image/${format};base64,${base64Value}`;
      }
      if (row && col.format && row[col.field]) {
        const base64Value = row[col.field];
        const format = col.format;
        
        if (typeof base64Value === 'string' && base64Value.startsWith('data:image')) {
          return base64Value;
        }
        return `data:image/${format};base64,${base64Value}`;
      }
    }
    
    if (!value) return '';
      if (typeof value === 'object' && value.base64 && value.format) {
      const base64Value = value.base64;
      const format = value.format;
      if (typeof base64Value === 'string' && base64Value.startsWith('data:image')) {
        return base64Value;
      }
      const result = `data:image/${format};base64,${base64Value}`;
      return result;
    }
    
    if (typeof value === 'string' && value.startsWith('data:image')) {
      return value;
    }
    
    return '';
  }

  isRowExpanded(row: any): boolean {
    return this.expandedRows.has(row);
  }

  toggleRowExpansion(row: any): void {
    if (this.expandedRows.has(row)) {
      this.expandedRows.delete(row);
    } else {
      this.expandedRows.add(row);
    }
  }

  getRowKey(row: any): any {
    return row[this.dataKey];
  }

  hasExpandedTemplate(): boolean {
    return !!this.expandedTemplate;
  }

  getColumnPermission(column: TableColumn): any {
    if (column.permission) {
      return {
        path: column.permission.path,
        action: column.permission.action
      };
    }
    return null;
  }

  shouldShowTooltip(value: any, column: TableColumn, row: any): boolean {
    if (!column.tooltip?.enabled) return false;
    
    const maxLength = column.tooltip.maxLength || 40;
    const textValue = this.getTooltipText(value, column, row);
    
    return textValue ? textValue.length > maxLength : false;
  }

  getTooltipText(value: any, column: TableColumn, row: any): string {
    if (!column.tooltip?.enabled) return '';
    
    if (column.tooltip.customText) {
      return column.tooltip.customText(row);
    }
    
    if (column.tooltip.field) {
      return row[column.tooltip.field] || '';
    }
    
    return this.formatValue(value, column);
  }

  getTooltipPosition(column: TableColumn): string {
    return column.tooltip?.position || 'top';
  }

  getTruncatedText(value: any, column: TableColumn): string {
    if (!column.tooltip?.enabled) return this.formatValue(value, column);
    
    const maxLength = column.tooltip.maxLength || 40;
    const textValue = this.formatValue(value, column);
    
    if (textValue.length > maxLength) {
      return textValue.slice(0, maxLength) + '...';
    }
    
    return textValue;
  }
}
