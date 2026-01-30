import { IIdName } from "@/shared/interfaces/id-name.interface";

export default interface IVariable extends IIdName {
    lastReading: LastReading | null;
}

interface LastReading {
    value: number;
    readingTime: string;
}