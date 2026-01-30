import { EFurnaceTypes } from "@/shared/enums/furnace-types.enum";
import { IIdName } from "@/shared/interfaces/id-name.interface";

export default interface IFurnaceEntity extends IIdName{
  description: string;
  type:EFurnaceTypes
}