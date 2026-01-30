import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IDefaultAnalysisResponse extends IIdName{
    shortName: string;
    selected: boolean;
}