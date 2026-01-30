import { IObserverEntity } from "./observer.entity";

export interface IUpdateObserverParamsEntity
    extends Partial<Pick<IObserverEntity, "documentNumber" | "name">>,
        Pick<IObserverEntity, "id"> {
    documents?: {
        cc?: File | null;
        arl?: File | null;
    };
}
