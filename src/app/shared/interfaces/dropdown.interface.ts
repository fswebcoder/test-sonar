import { IIdName } from "./id-name.interface";

export interface IDropdown {
    suppliers:    IIdName[];
    sampleTypes: IIdName[];
    batchNumbers: string[];
}