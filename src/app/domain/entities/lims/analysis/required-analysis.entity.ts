import { IAnalysisEntity } from "./analysis.entity";

export interface IRequiredAnalysisEntity  extends Omit<IAnalysisEntity<{}>, "resultValue" | "analysisDate">{
    id:string;
    done:{
        label: AnalysisStatus;
        value: boolean;
    };
}

export enum AnalysisStatus {
    FINISHED = 'Finalizado',
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En análisis'
}