import { IAction } from "./actions.interface";
import { IIdName } from "./id-name.interface";

export interface IResource extends IIdName {
    icon: string;
    path: string;
    subresources?: IResource[];
    action?:       IAction;
}