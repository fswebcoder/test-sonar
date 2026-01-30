import { ICompany } from "@/shared/entities/company.entity";
import { ITokens } from "@/shared/entities/tokens.entity";
import { IUuid } from "@/shared/entities/uuid.entity";

export interface ILoginResponseEntity  {
    id: IUuid
    name: string
    email: string
    companies: ICompany[]
    tokens: ITokens
}

export interface IDocumentType extends IUuid {
    name: string
    code: string;
}