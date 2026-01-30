import { ESampleDetailRequiredAnalysisStatus } from "@/shared/enums/sample-detail-required-analysis-status.enum";
import ISampleDetailAnalysesEntity from "./sample-detail-analyses.entity";

export default interface ISampleDetailRequiredAnalysesEntity {
    id: string;
    analysisName: string;
    analysisShortName: string;
    status: ESampleDetailRequiredAnalysisStatus;
    analyses: ISampleDetailAnalysesEntity[];
    replicatedIndex: number
}
