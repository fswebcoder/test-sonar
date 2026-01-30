import { IIdName } from "./id-name.interface";
import { IResource } from "./resources.interface";

export interface IApplication extends IIdName {

    path: string;
    isActive:  boolean;
    resources: IResource[];
}



