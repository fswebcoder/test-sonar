import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IMillCatalog extends IIdName{
    isActive: boolean;
    description: string;
}