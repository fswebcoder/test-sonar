import { IActionEntity } from "@/domain/entities/common/action.entity";
import { IRoleEntity } from "./role.entity";

export interface IRoleDetailEntity extends Omit<IRoleEntity, 'isActive'> {
    actions: IActionEntity[];
}