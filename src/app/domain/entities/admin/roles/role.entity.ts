import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IRoleEntity extends IIdName {
    isActive: boolean;
    description: string;
}

