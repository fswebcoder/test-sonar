import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface ISampleTypeEntity extends IIdName{
    shortName: string;
    description: string;
    isActive: boolean;
    autoGenerateCode: boolean;
    defaultAnalysesIds?: string[];
}