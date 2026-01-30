import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IPrinter {
    id: string;
    ip: string;
    port: string;
    company: ICompany;
    printerName: string;
    isActive: boolean;
  }
  
  export interface ICompany extends IIdName{}
  