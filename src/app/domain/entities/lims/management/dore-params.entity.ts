import { IParamsDate } from "@/shared/interfaces/params-date.interface";
import { TPaginationParams } from "@SV-Development/utilities";

export interface IDoreParamsEntity extends Pick<TPaginationParams, 'page' | 'limit' >, IParamsDate {
    sampleTypeIds?: string[];
    supplierIds?: string[];
    doreIds?: string[];
    batchNumbers?: string[];
}