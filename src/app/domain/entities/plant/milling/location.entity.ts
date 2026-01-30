import { IIdName } from "@/shared/interfaces/id-name.interface";
import IVariable from "./variable.entity";

export default interface ILocation extends IIdName {
  variables: IVariable[]
}
