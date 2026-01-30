import { ISampleScaleInfo } from "./sample-scale-info.entity";

export interface ITareScaleEntity extends ISampleScaleInfo{
    tare: {
        tare: number | null,
        tareRaw: string,
        zeroResponse: string,
        message:string
    }
}