import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableColumn, TableComponent } from '@/shared/components/table/table.component';
import { Subscription } from 'rxjs';
import { XrfPeriodicTableComponent } from './components/xrf-periodic-table/xrf-periodic-table.component';
import { GroupedViewComponent } from './components/grouped-view/grouped-view.component';
import { FilterSectionComponent } from './components/filter-section/filter-section.component';

import { XRF_ELEMENT_MAP } from '@/shared/constants/xrf-element-map';
import { ICONS } from '@/shared/enums/general.enum';
import ISampleDetailRequiredAnalysesEntity from '@/domain/entities/lims/management/sample-detail-required-analyses.entity';

interface IAnalysisResultItem {
  key: string;
  value: any;
  label?: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
}

interface IGroupedAnalysisElement {
  baseKey: string;
  symbol: string;
  mainValue: IAnalysisResultItem;
  uncertaintyValue?: IAnalysisResultItem;
  relatedValues: IAnalysisResultItem[];
  elementClass: string;
}

@Component({
  selector: 'svi-analysis-results-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TagModule,
    CardModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    TableComponent,
    XrfPeriodicTableComponent,
    GroupedViewComponent,
    FilterSectionComponent
  ],
  templateUrl: './analysis-results-content.component.html',
  styleUrl: './analysis-results-content.component.scss'
})
export class AnalysisResultsContentComponent implements OnInit, OnDestroy {
  analysisData = input<ISampleDetailRequiredAnalysesEntity | null>(null);
  rawResultValues = signal<any[]>([]);
  allResultItems = signal<IAnalysisResultItem[][]>([]);
  allGroupedElements = signal<IGroupedAnalysisElement[][]>([]);
  allPeriodicTableElements = signal<any[][]>([]);
  filterText = signal<string>('');
  filteredElements = signal<IGroupedAnalysisElement[]>([]);

  ICONS = ICONS;

  filterControl = new FormControl('');
  private filterSubscription?: Subscription;

  allTableData = computed(() => {
    const raws = this.rawResultValues();
    return raws.map(rv => this.tableDataFor(rv));
  });
  allTableColumns = computed((): TableColumn[][] => {
    const raws = this.rawResultValues();
    return raws.map(rv => this.tableColumnsFor(rv));
  });

  shouldShowGroupedView = computed(() => {
    const data = this.analysisData();
    const sampleName = (data?.analysisName || '').toLowerCase();
    return sampleName.includes('xrf');
  });

  isXrfAnalysis = computed(() => {
    const data = this.analysisData();
    return (
      data?.analysisName?.toLowerCase().includes('xrf') ||
      data?.analysisShortName?.toLowerCase().includes('xrf') ||
      data?.analysisName?.toLowerCase().includes('xrf')
    );
  });

  filteredPeriodicElements = computed(() => {
    const filter = this.filterText().toLowerCase();
    const allPeriodicElements = this.allPeriodicTableElements();
    const firstPeriodicElements = allPeriodicElements[0] || [];
    return !filter
      ? firstPeriodicElements
      : firstPeriodicElements.filter(
          e =>
            e.symbol.toLowerCase().includes(filter) ||
            e.name.toLowerCase().includes(filter) ||
            e.atomicNumber.toString().includes(filter)
        );
  });

  processedGroupedElements = computed(() => {
    const allGrouped = this.allGroupedElements();
    const firstGrouped = allGrouped[0] || [];
    return firstGrouped.map(element => ({
      symbol: element.symbol,
      baseKey: element.baseKey,
      formattedKey: this.formatKey(element.baseKey),
      mainValue: {
        hasValue: this.isValueAvailable(element.mainValue.value),
        displayValue: this.getDisplayValue(element.mainValue)
      },
      uncertaintyValue: element.uncertaintyValue
        ? {
            hasValue: this.isValueAvailable(element.uncertaintyValue.value),
            displayValue: this.getDisplayValue(element.uncertaintyValue)
          }
        : undefined,
      elementClass: element.elementClass,
      tooltip: this.getGroupedElementTooltip(element)
    }));
  });

  processedFilteredElements = computed(() => {
    const filtered = this.filteredElements();
    return filtered.map(element => ({
      symbol: element.symbol,
      baseKey: element.baseKey,
      formattedKey: this.formatKey(element.baseKey),
      mainValue: {
        hasValue: this.isValueAvailable(element.mainValue.value),
        displayValue: this.getDisplayValue(element.mainValue)
      },
      uncertaintyValue: element.uncertaintyValue
        ? {
            hasValue: this.isValueAvailable(element.uncertaintyValue.value),
            displayValue: this.getDisplayValue(element.uncertaintyValue)
          }
        : undefined,
      elementClass: element.elementClass,
      tooltip: this.getGroupedElementTooltip(element)
    }));
  });

  constructor() {
    effect(() => {
      const data = this.analysisData();
      if (!data?.analyses?.length) {
        this.allResultItems.set([]);
        this.allGroupedElements.set([]);
        this.allPeriodicTableElements.set([]);
        this.rawResultValues.set([]);
        return;
      }

      const results = data.analyses.map(analysis => {
        const fullResult = analysis?.resultValue ?? [];
        const items = this.processResultValue(fullResult);
        return {
          items,
          grouped: this.processGroupedElementsFromItems(items),
          periodic: this.isXrfAnalysis() ? this.processXrfPeriodicTableFromItems(items) : [],
          raw: fullResult
        };
      });

      this.allResultItems.set(results.map(r => r.items));
      this.allGroupedElements.set(results.map(r => r.grouped));
      this.allPeriodicTableElements.set(results.map(r => r.periodic));
      this.rawResultValues.set(results.map(r => r.raw));
    });

    effect(() => {
      const filter = this.filterText().toLowerCase();
      const firstGrouped = this.allGroupedElements()[0] || [];
      this.filteredElements.set(
        filter ? firstGrouped.filter(e => 
          e.symbol.toLowerCase().includes(filter) ||
          e.baseKey.toLowerCase().includes(filter)
        ) : firstGrouped
      );
    });
  }

  buildItemsFromResultValue(resultValue: any): IAnalysisResultItem[] {
    if (!resultValue || typeof resultValue !== 'object') return [];
    return Object.entries(resultValue).map(([key, value]) => {
      const hasValueLabel = value && typeof value === 'object' && 'value' in value;
      return {
        key: hasValueLabel ? String((value as any).label || key) : key,
        value: hasValueLabel ? (value as any).value : value,
        type: this.determineType(hasValueLabel ? (value as any).value : value)
      };
    });
  }

  buildTableData(items: IAnalysisResultItem[]): any[] {
    if (!items.length) return [];
    const rowData = items.reduce((acc, item) => {
      acc[item.key] = item.value;
      acc[`${item.key}_type`] = item.type;
      return acc;
    }, {} as any);
    return [rowData];
  }

  buildTableColumns(items: IAnalysisResultItem[]): TableColumn[] {
    return items.map(item => ({
      field: item.key,
      header: item.label || this.formatKey(item.key),
      type: item.type as 'text' | 'number' | 'date' | 'boolean' | 'image' | 'actions' | 'badge',
      align: 'center' as const,
      template: (rowData: any) => this.formatTableCell(rowData[item.key], item.type),
      isHtml: true
    }));
  }

  private isResultArray(rv: any): rv is any[] {
    return Array.isArray(rv) && rv.length > 0 && typeof rv[0] === 'object';
  }

  private buildColumnsFromArray(rows: any[]): TableColumn[] {
    const first = rows[0] ?? {};
    return Object.keys(first).map(key => {
      const cell = first[key];
      const hasValueObj = cell && typeof cell === 'object' && 'value' in cell;
      const value = hasValueObj ? cell.value : cell;
      const type = this.determineType(value) as 'text' | 'number' | 'date' | 'boolean' | 'image' | 'actions' | 'badge';
      
      return {
        field: key,
        header: hasValueObj && cell.label ? cell.label : this.formatKey(key),
        type,
        align: 'center' as const,
        template: (rowData: any) => {
          const cellValue = rowData[key];
          const innerValue = cellValue && typeof cellValue === 'object' && 'value' in cellValue ? cellValue.value : cellValue;
          const mappedType = type === 'text' ? 'string' : type as 'string' | 'number' | 'boolean' | 'object' | 'date' | 'array';
          return this.formatTableCell(innerValue, mappedType);
        },
        isHtml: true
      };
    });
  }

  private buildDataFromArray(rows: any[]): any[] {
    return Array.isArray(rows) ? rows : [];
  }

  tableColumnsFor(resultValue: any): TableColumn[] {
    if (this.isResultArray(resultValue)) {
      return this.buildColumnsFromArray(resultValue);
    }
    const items = this.buildItemsFromResultValue(resultValue);
    return this.buildTableColumns(items);
  }

  tableDataFor(resultValue: any): any[] {
    if (this.isResultArray(resultValue)) {
      return this.buildDataFromArray(resultValue);
    }
    const items = this.buildItemsFromResultValue(resultValue);
    return this.buildTableData(items);
  }

  ngOnInit(): void {
    this.filterSubscription = this.filterControl.valueChanges.subscribe(value => {
      this.filterText.set(value || '');
    });
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private processResultValue(resultValue: any): IAnalysisResultItem[] {
    if (!resultValue) return [];
    
    const dataToProcess = Array.isArray(resultValue) && resultValue.length > 0 ? resultValue[0] : resultValue;
    if (typeof dataToProcess !== 'object' || dataToProcess === null) return [];

    return Object.entries(dataToProcess).map(([key, valueObj]) => {
      const hasValueLabel = valueObj && typeof valueObj === 'object' && 'value' in valueObj;
      const value = hasValueLabel ? (valueObj as any).value : valueObj;
      const label = hasValueLabel ? (valueObj as any).label : this.formatKey(key);
      
      return {
        key,
        value,
        label,
        type: this.determineType(value)
      };
    });
  }

  private processGroupedElementsFromItems(items: IAnalysisResultItem[]): IGroupedAnalysisElement[] {
    const grouped = new Map<string, IGroupedAnalysisElement>();

    items.forEach(item => {
      const baseKey = this.extractBaseKey(item.key);
      const symbol = this.getElementSymbol(baseKey);
      const isUncertainty = this.isUncertaintyKey(item.key);
      const existing = grouped.get(symbol);

      if (!existing) {
        grouped.set(symbol, {
          baseKey,
          symbol,
          mainValue: isUncertainty ? { key: baseKey, value: '', type: 'string', label: baseKey } : item,
          uncertaintyValue: isUncertainty ? item : undefined,
          relatedValues: [item],
          elementClass: this.getElementClass(item.type)
        });
      } else {
        existing.relatedValues.push(item);
        if (isUncertainty) {
          existing.uncertaintyValue = item;
        } else {
          existing.mainValue = item;
          existing.elementClass = this.getElementClass(item.type);
          existing.baseKey = baseKey;
        }
      }
    });

    return Array.from(grouped.values());
  }

  private extractBaseKey(key: string): string {
    return key.replace(/\s+(error|err)/i, '').replace(/(error|value|result|min|max|avg|std|dev|err|_error)$/i, '').trim();
  }

  private isUncertaintyKey(key: string): boolean {
    return /(_error|\s*(error|err))$/i.test(key);
  }

  isValueAvailable(value: any): boolean {
    return value != null && value !== '';
  }

  private determineType(value: any): IAnalysisResultItem['type'] {
    if (value == null) return 'string';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('-'))) return 'date';
    if (typeof value === 'object') return 'object';
    return 'string';
  }

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }

  formatDate(value: any): string {
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    }).format(value);
  }

  formatObject(value: any): string {
    return JSON.stringify(value, null, 2);
  }

  getElementClass(type: IAnalysisResultItem['type']): string {
    return `element-${type}`;
  }

  getElementSymbol(key: string): string {
    const cleaned = key.replace(/[^a-zA-Z]/g, '');
    return cleaned.length >= 2 ? cleaned.substring(0, 2).toUpperCase() : cleaned.toUpperCase().padEnd(2, 'X');
  }

  getDisplayValue(item: IAnalysisResultItem): string {
    if (!this.isValueAvailable(item.value) || item.value === 'N/A') return '-';
    
    const typeHandlers = {
      boolean: () => item.value ? 'Sí' : 'No',
      date: () => new Date(item.value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      number: () => this.formatNumber(item.value),
      object: () => 'Objeto',
      array: () => `${item.value.length} elementos`
    };
    
    const handler = typeHandlers[item.type as keyof typeof typeHandlers];
    if (handler) return handler();
    
    const strValue = String(item.value);
    return strValue.length > 12 ? strValue.substring(0, 12) + '...' : strValue;
  }

  formatTableCell(value: any, type: IAnalysisResultItem['type']): string {
    if (!this.isValueAvailable(value)) return '-';

    if (value === '<LOD') {
      return '<span class="p-tag p-component p-tag-warning p-tag-sm">&lt;LOD</span>';
    }

    const formatters = {
      boolean: () => value 
        ? '<i class="fa-duotone fa-check text-green-600 text-xl"></i>' 
        : '<i class="fa-duotone fa-times text-red-600 text-xl"></i>',
      date: () => `<span class="text-sm font-medium">${this.formatDate(value)}</span>`,
      number: () => `<span class="font-mono font-medium">${this.formatNumber(value)}</span>`,
      object: () => `<div class="max-w-20rem overflow-hidden mx-auto"><pre class="text-xs bg-gray-100 p-2 border-round text-left">${this.formatObject(value)}</pre></div>`,
      array: () => `<div class="flex flex-wrap gap-1 justify-content-center">${Array.isArray(value) ? value.map((item: any) => `<span class="p-tag p-component p-tag-info p-tag-sm">${item}</span>`).join('') : ''}</div>`
    };

    const formatter = formatters[type as keyof typeof formatters];
    return formatter ? formatter() : `<span class="font-medium">${String(value)}</span>`;
  }

  getGroupedElementTooltip(element: IGroupedAnalysisElement): string {
    const mainValue = this.isValueAvailable(element.mainValue.value) ? this.getDisplayValue(element.mainValue) : '-';
    const uncertainty = element.uncertaintyValue && this.isValueAvailable(element.uncertaintyValue.value) 
      ? this.getDisplayValue(element.uncertaintyValue) : '-';
    
    return `${this.formatKey(element.baseKey)}\n📊 Valor: ${mainValue}\n� Incertidumbre: ${uncertainty}\n�🔬 Tipo: ${element.mainValue.type}\n📋 Total elementos: ${element.relatedValues.length}`;
  }

  clearFilter(): void {
    this.filterText.set('');
    this.filterControl.setValue('');
  }

  getResultsCount(): number {
    return this.rawResultValues().length;
  }

  getTableDataAt(index: number): any[] {
    return this.allTableData()[index] || [];
  }

  getTableColumnsAt(index: number): TableColumn[] {
    return this.allTableColumns()[index] || [];
  }


  private processXrfPeriodicTableFromItems(items: IAnalysisResultItem[]): any[] {
    return Object.entries(XRF_ELEMENT_MAP).map(([key, info]) => {
      const valueItem = items.find(i => i.key.toLowerCase() === key.toLowerCase());
      const errorItem = items.find(i => i.key.toLowerCase() === `${key.toLowerCase()}_error`);
      
      const rawValue = valueItem?.value;
      const rawError = errorItem?.value;
      const isLod = rawValue === '<LOD';
      const hasValue = !!valueItem && this.computeHasValue(rawValue);
      
      return {
        ...info,
        value: valueItem ? rawValue : null,
        error: errorItem ? rawError : null,
        type: valueItem?.type ?? 'number',
        hasValue: !!hasValue,
        displayValue: valueItem ? (isLod ? '<LOD' : `${rawValue}${errorItem ? ` ± ${rawError}` : ''}`) : '-'
      };
    }).sort((a, b) => a.atomicNumber - b.atomicNumber);
  }

  private computeHasValue(rawValue: any): boolean {
    if (rawValue === null || rawValue === undefined) return false;
    if (rawValue === '<LOD') return true;
    if (typeof rawValue === 'number') return rawValue !== 0 && !isNaN(rawValue);
    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      if (trimmed === '' || trimmed === '0') return false;
      return true;
    }
    return false;
  }
}
