import { IRoleEntity } from "./role.entity";

export interface IRoleCatalogEntity extends Pick<IRoleEntity, 'id' | 'name' |'description'> {
}