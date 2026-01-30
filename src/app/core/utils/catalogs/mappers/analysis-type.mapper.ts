import { IAnalysisTypeResponse } from "@/domain/entities/common/analysis-type-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";

export const analysisTypeMapper: Mapper<IAnalysisTypeResponse, IAnalysisTypeResponse> = {
    toDomain(dto: IAnalysisTypeResponse): IAnalysisTypeResponse {
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
        }
    },

    toDTO(domain: IAnalysisTypeResponse): IAnalysisTypeResponse {
        return {
            id: domain.id,
            name: domain.name,
            description: domain.description,
        }
    }
}