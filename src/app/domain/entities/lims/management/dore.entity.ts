import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IDoreEntity {
    id: string;
    code: number;
    receivedWeight: string;
    base64: string;
    format: string;
    status: IIdName;
}