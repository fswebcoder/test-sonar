import { EOrderScaleStatus } from "@/shared/enums/order-scale-status.enum";
import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IDocumentType {
    id: string;
    name: string;
    code: string;
}

export interface IVehicleDocuments {
    registrationUrl?: string | null;
    soatUrl?: string | null;
    technomechanicalUrl?: string | null;
}

export interface IPersonDocuments {
    ccUrl?: string | null;
    arlUrl?: string | null;
}

export interface IOrderVehicle {
    id: string;
    plate: string;
    vehicleType?: IIdName;
    documents: IVehicleDocuments;
}

export interface IOrderDriver {
    id: string;
    name: string;
    documentNumber: string;
    documentType?: IDocumentType;
    documents: IPersonDocuments;
}

export interface IOrderVeedor {
    id: string;
    name: string;
    documentNumber: string;
    documentType?: IDocumentType;
    documents: IPersonDocuments;
}

export interface IOrderEntity {
    id: string;
    consecutive: string;
    vehicle: IOrderVehicle;
    driver: IOrderDriver;
    supplier: IIdName;
    mine?: IIdName;
    veedor?: IOrderVeedor | null;
    firstWeight: string | null;
    urlFirstWeightImage?: string | null;
    secondWeight: string | null;
    urlSecondWeightImage?: string | null;
    batch?: IIdName;
    netWeight: string | null;
    dateFirstWeight: string | null;
    dateSecondWeight: string | null;
    originStorageZone?: IIdName;
    destinationStorageZone: IIdName;
    materialType: IIdName;
    status: EOrderScaleStatus;
}
