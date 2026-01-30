import { PaginationMetadata } from "./pagination-metadata";
export type PaginatedData<T> = {
  items: T[];
  meta: PaginationMetadata;
}