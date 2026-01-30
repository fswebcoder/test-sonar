import { ICreateRolesParamsEntity } from "./create-roles-params.entity";

export interface IUpdateRoleParamsEntity extends Partial<Omit<ICreateRolesParamsEntity, 'id'>> {
}