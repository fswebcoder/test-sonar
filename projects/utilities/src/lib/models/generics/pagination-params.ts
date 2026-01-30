
export type TPaginationParams = {
  page?: number;
  limit?: number;
  withDeleted?: boolean;
  startDate?: string;
  endDate?: string;
  date?: string;
  search?: string;
  sort?: string;
  order?: string;
  filter?: string;
  filterValue?: string;
  filterOperator?: string;
  filterType?: string;
  totalRecords?: number;
  sampleTypeIds?: string[];
  sampleIds?: string[];
  supplierIds?: string[];
  sampleCode?: string;
  statusIds?: string[];
}
