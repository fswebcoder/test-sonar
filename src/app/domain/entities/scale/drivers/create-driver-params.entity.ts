import { IDriverEntity } from "./driver.entity";

export interface ICreateDriverParamsEntity extends Pick<IDriverEntity, "documentNumber"| "name">{
    documentTypeId: string;
    cc?: File | null;
    arl?: File | null;
}