import { ICreateUsersParamsEntity } from "./create-users-params.entity";

export interface IUpdateUsersParamsEntity extends Partial<Omit<ICreateUsersParamsEntity, 'password'>>{
    userId: string;
}