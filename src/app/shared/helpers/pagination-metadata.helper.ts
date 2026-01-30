import { PaginationMetadata } from '@SV-Development/utilities';
import { PaginationService } from '@/shared/services/pagination.service';

export const buildFallbackPaginationMetadata = (paginationService: PaginationService): PaginationMetadata => {
  const paginationState = paginationService.paginationState();
  const totalRecords = paginationService.getTotalRecords();
  const limit = paginationState.rows ?? 0;
  const page = paginationState.page ?? 1;
  const totalPages = limit ? Math.ceil(totalRecords / limit) : 0;

  return {
    page,
    limit,
    total: totalRecords,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPreviousPage: page > 1
  };
};

export const getFallbackRowsPerPage = (paginationService: PaginationService): number => {
  const paginationState = paginationService.paginationState();
  return paginationState.rows ?? paginationService.getPaginationParams().limit ?? 10;
};
