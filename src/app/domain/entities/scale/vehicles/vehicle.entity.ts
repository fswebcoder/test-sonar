import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IVehicle {
    id: string;
    plate: string;
    isActive: boolean;
    vehicleType: IIdName;
    documents: {
        soatUrl?: string;
        technomechanicalUrl?: string;
        registrationUrl?: string;
    };
}