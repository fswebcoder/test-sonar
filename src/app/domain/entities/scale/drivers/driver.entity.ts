import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IDriverEntity extends IIdName {
    documentNumber:string
    isActive:boolean
    documents: {
        ccUrl?: string
        arlUrl?: string
    },
    documentType: IIdName & {
        code: string
    } 
}