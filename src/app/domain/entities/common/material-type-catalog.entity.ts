import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IMaterialTypeCatalogEntity extends IIdName {
    isActive: boolean;
    enableBatch: boolean;
    requiresRemissionDocument: boolean;
}