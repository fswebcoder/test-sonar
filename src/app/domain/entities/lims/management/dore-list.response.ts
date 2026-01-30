import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IDoreEntity } from "./dore.entity";

export interface IDoreListResponseEntity {
    id: string;
    batchNumber: Object;
    receptionDate: string;
    observation: Object;
    dore: IDoreEntity[];
    supplier: IsupplierListResponseEntity;
}