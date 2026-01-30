import { IIdName } from "@/shared/interfaces/id-name.interface";


export interface IMillingDetailEntity {
    mill: IIdName;
    millingRecords: IMillingRecordEntity[];
    millControlTracking: IMillControlTrackingEntity;
}

export interface IMillingRecordEntity {
    id: string;
    date: string;
    batch: IIdName;
    pump: IIdName;

    mill?: IIdName;
    millControlTracking?: IMillControlTrackingEntity;
    stateRecord: IMillingStateRecordEntity[];
    equipmentSchemaProcessMill: IEquipmentSchemaProcessMill[];
    weight?: string;
}

export interface IMillingStateRecordEntity {
    stateRecord: string;
    dateRecord: string;
    restartDate: string;
    reason: string;
}

export interface IEquipmentSchemaProcessMill extends IIdName{
    location: ILocationSchemaProcessMill[];
}

export interface ILocationSchemaProcessMill extends IIdName{
    variables: IVariableSchemaProcessMill[];
}

export interface IVariableSchemaProcessMill extends IIdName{
    data: IVariableDataProcessMill[];
}

export interface IVariableDataProcessMill {
    value: number;
    readingTime: string;
}

export interface IMillControlTrackingEntity {
    milledTonnage: string;
    densityAverages: IDensityAveragesEntity;
    frequencyAverage: IFrequencyAverageEntity;
    reagentAverages: IReagentAveragesEntity;
}

export interface IDensityAveragesEntity {
    trommel: string;
    feed: string;
    overflow: string;
    underflow: string;
    tailings: string;
}

export interface IFrequencyAverageEntity {
    averageHz: string;
}

export interface IReagentAveragesEntity {
    collector: string;
    promoter: string;
    frother: string;
}