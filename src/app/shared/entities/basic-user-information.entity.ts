import { IUuid } from "./uuid.entity"

export interface IBasicUserInformation extends IUuid {
    name: string
    email: string
}