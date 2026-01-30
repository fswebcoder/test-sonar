import { IGeneralResponse } from "@SV-Development/utilities";
import IMill from "./mill.entity";

export default interface IGetMillsResponseEntity extends IGeneralResponse<IMill[]> {}