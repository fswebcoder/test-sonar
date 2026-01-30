import { ICompany } from "@/shared/entities/company.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { IApplication } from "@/shared/interfaces/applications.interface";
export interface IPermissionsResponseEntity {
    company: ICompany;
    roles: IRole[];
    applications: IApplication[];
}

export interface IRole extends IIdName {}