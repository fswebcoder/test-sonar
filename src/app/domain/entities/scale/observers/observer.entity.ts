import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IObserverEntity extends IIdName {
    documentNumber: string;
    isActive: boolean;
    documents: {
        ccUrl?: string;
        arlUrl?: string;
    };
    documentType: IIdName & {
        code: string;
    };
}
