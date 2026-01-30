import { GenericResponseType } from "@/shared/types/generic-response.type";
import { IAnalysisEntity } from "../lims/analysis/analysis.entity";

export interface IAnalysisTypeResponse extends GenericResponseType, Pick<IAnalysisEntity<unknown>, 'analysisShortName'> {
    description: string;
}