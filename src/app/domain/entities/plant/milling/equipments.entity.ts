import { IIdName } from "@/shared/interfaces/id-name.interface";
import ILocation from "./location.entity";

export default interface IEquipment extends IIdName{
  description: string;
  status: string;
  location:ILocation[]
}