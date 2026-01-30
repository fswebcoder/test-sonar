import { computed, Injectable, signal } from '@angular/core';
import { TPaginationParams } from '@SV-Development/utilities';
import { PaginatorState } from 'primeng/paginator';

interface PaginationState extends TPaginationParams {
  rows: number;
  first: number;
  totalRecords: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private readonly paginationInitialState: PaginationState = {
    page: 1,
    limit: 9,
    withDeleted: undefined,
    startDate: '',
    endDate: '',
    search: '',
    sort: '',
    order: '',
    filter: '',
    filterValue: '',
    filterOperator: '',
    filterType: '',
    totalRecords: 0,
    first: 0,
    rows: 9,
    sampleIds: [],
    sampleTypeIds: [],
    supplierIds: [],
    sampleCode: '',
    statusIds: [],
    date: ''
  };

  private readonly _paginationState = signal<PaginationState>({ ...this.paginationInitialState });

  readonly paginationState = computed(() => this._paginationState());
  readonly currentPage = computed(() => this._paginationState().page);
  readonly pageSize = computed(() => this._paginationState().rows);
  readonly withDeleted = computed(() => this._paginationState().withDeleted);
  readonly totalPages = computed(() =>
    Math.ceil((this._paginationState()?.totalRecords ?? 0) / (this._paginationState()?.rows ?? 0))
  );

  updatePagination(event: PaginatorState): void {
    this._paginationState.update(state => ({
      ...state,
      first: event.first ?? 0,
      rows: event.rows ?? state.rows,
      page: (event.first ?? 0) / (event.rows || 9) + 1
    }));
  }

  setTotalRecords(total: number): void {
    this._paginationState.update(state => ({
      ...state,
      totalRecords: total
    }));
  }

  setWithDeleted(withDeleted: boolean): void {
    this._paginationState.update(state => ({
      ...state,
      withDeleted: withDeleted
    }));
  }

  setStartDate(startDate: string): void {
    this._paginationState.update(state => ({
      ...state,
      startDate: startDate
    }));
  }
  setEndDate(endDate: string): void {
    this._paginationState.update(state => ({
      ...state,
      endDate: endDate
    }));
  }

  setSearch(search: string): void {
    this._paginationState.update(state => ({
      ...state,
      search: search
    }));
  }

  setSampleCode(sampleCode: string): void {
    this._paginationState.update(state => ({
      ...state,
      sampleCode: sampleCode
    }));
  }

  setSupplierIds(supplierIds: string[]): void {
    this._paginationState.update(state => ({
      ...state,
      supplierIds: supplierIds
    }));
  }

  setStatusIds(statusIds: string[]): void {
    this._paginationState.update(state => ({
      ...state,
      statusIds: statusIds
    }));
  }

  setSampleTypeIds(sampleTypeIds: string[]): void {
    this._paginationState.update(state => ({
      ...state,
      sampleTypeIds: sampleTypeIds
    }));
  }
  setSampleIds(sampleIds: string[]): void {
    this._paginationState.update(state => ({
      ...state,
      sampleIds: sampleIds
    }));
  }

  setDate(date: string): void {
    this._paginationState.update(state => ({
      ...state,
      date: date
    }));
  }

  resetPagination(): void {
    this._paginationState.set(this.paginationInitialState);
  }

  getPaginationParams(): TPaginationParams {
    const state = this._paginationState();
    return {
      page: state.page,
      limit: state.rows,
      withDeleted: state.withDeleted,
      startDate: state.startDate,
      endDate: state.endDate,
      search: state.search,
      sort: state.sort,
      order: state.order,
      filter: state.filter,
      filterValue: state.filterValue,
      filterOperator: state.filterOperator,
      filterType: state.filterType,
      sampleIds: state.sampleIds,
      sampleTypeIds: state.sampleTypeIds,
      supplierIds: state.supplierIds,
      sampleCode: state.sampleCode,
      statusIds: state.statusIds,
      date: state.date
    };
  }

  getTotalRecords() {
    return this._paginationState().totalRecords;
  }
}
