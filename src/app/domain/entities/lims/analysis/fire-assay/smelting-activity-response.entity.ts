import { IGeneralResponse } from "@SV-Development/utilities";
import IFireAssayDetail from "./fire-assay-detail.entity";

export default interface ISmeltingActivityResponse extends IGeneralResponse<ISmeltingActivityData | null> {

}
export interface ISmeltingActivityData {
  fireAssayId: string;
  rows: number;
  columns: number;
  smeltingFurnaceId: string;
  smeltingStatus: string;
  fireAssayDetail: IFireAssayDetail[]
  date?: string;
}




