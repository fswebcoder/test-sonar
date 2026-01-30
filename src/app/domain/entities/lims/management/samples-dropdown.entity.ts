import { IIdName } from "@/shared/interfaces/id-name.interface";
import { IDropdown } from "@/shared/interfaces/dropdown.interface";

export interface ISamplesDropdownEntity extends Omit<IDropdown, 'batchNumbers'>{
    samples: ISampleDropdown[];
    statuses: ISampleDropdown[];
}

export interface ISampleDropdown extends Omit<IIdName, 'name'> {
    code: string;
}