import { IIdName } from "@/shared/interfaces/id-name.interface";
import IEquipment from "./equipments.entity";
import { EmillingStates } from "@/shared/enums/milling-states.enum";

export default interface IMill {
  infoShiftId: string;
  mill: IIdName;
  pump: IIdName;
  batch: IIdName;
  status: EmillingStates;
  equipment: IEquipment[];
}