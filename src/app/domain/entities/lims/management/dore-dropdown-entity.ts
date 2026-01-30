import { IDropdown } from "@/shared/interfaces/dropdown.interface";

export interface IDoreDropdownEntity extends IDropdown{
    dore: IDoreDropdown[];
}

interface IDoreDropdown {
    id: number;
    code: string;
}

