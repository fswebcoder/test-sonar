import { ISampleScaleInfo } from "./sample-scale-info.entity";

export interface IWeightScaleEntity extends ISampleScaleInfo {
    weight: {
        weight: number | null,
        raw: string,
        message: string
    }
}