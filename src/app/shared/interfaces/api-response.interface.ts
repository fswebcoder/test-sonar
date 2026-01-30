import { IGeneralResponse, PaginatedData } from "@SV-Development/utilities";

export type IApiResponse<T, IsPaginated extends boolean = false> = 
  IsPaginated extends true 
    ? IGeneralResponse<PaginatedData<T>>
    : IGeneralResponse<T[]>;


export type SingleOrListResponse<T, IsSingle extends boolean = false> = 
  IsSingle extends true 
    ? IGeneralResponse<T>
    : IGeneralResponse<T[]>;


export type IFlexibleApiResponse<T, ResponseType extends 'single' | 'list' | 'paginated'> = 
  ResponseType extends 'single' 
    ? IGeneralResponse<T>
    : ResponseType extends 'list'
    ? IGeneralResponse<T[]>
    : IGeneralResponse<PaginatedData<T>>; 