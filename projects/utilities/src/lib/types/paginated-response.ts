import { IGeneralResponse, PaginatedData } from "../models/generics/generics";
export type PaginatedResponse<T> = IGeneralResponse<PaginatedData<T>>;
