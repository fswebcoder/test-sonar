import { IMaterialTypeEntity } from "./material-type.entity";

export interface ICreateMaterialTypeParamsEntity extends Pick<IMaterialTypeEntity, "name">{}