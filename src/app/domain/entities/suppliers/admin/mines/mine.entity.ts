import { IIdName } from "@/shared/interfaces/id-name.interface";

export interface IMineEntity extends IIdName {
  isActive: boolean;
  supplier?: IIdName;
  createdAt?: string;
  updatedAt?: string;
}
