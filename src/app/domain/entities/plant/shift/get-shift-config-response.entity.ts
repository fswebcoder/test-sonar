import { IGeneralResponse } from "@SV-Development/utilities";
import { IAreasOfOperationConfig } from "./shift.entity";

export default interface IGetShiftConfigResponseEntity extends IGeneralResponse<IAreasOfOperationConfig[]> {
}
