import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IMiningTitlesEntity extends IIdName {
    mineTypeId: string;
    mineTypeName: string;
    royaltyPercentage: string;
    cityId: string;
    cityName: string;
    departmentId: string;
    departmentName: string;

}