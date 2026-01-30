import { IMaterialTypeEntity } from "./material-type.entity";

export interface IUpdateMaterialTypeParamsEntity extends Pick<IMaterialTypeEntity, "id" | "name"> {}