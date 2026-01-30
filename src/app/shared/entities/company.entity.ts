import { IBranding } from "./branding.entity";
import { IUuid } from "./uuid.entity"

export interface ICompany extends IUuid {
    name:      string;
    shortName: string;
    role:      string;
    branding:  IBranding;
}