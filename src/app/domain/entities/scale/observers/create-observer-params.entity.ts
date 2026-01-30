import { IObserverEntity } from "./observer.entity";

export interface ICreateObserverParamsEntity extends Pick<IObserverEntity, "documentNumber" | "name"> {
    documentTypeId: string;
    cc?: File | null;
    arl?: File | null;
}
