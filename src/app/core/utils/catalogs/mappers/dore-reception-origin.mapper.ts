import { IDoreReceptionOriginResponse } from "@/domain/entities/common/dore-reception-origin-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";

export const doreReceptionOriginMapper: Mapper<IDoreReceptionOriginResponse, IDoreReceptionOriginResponse> = {
    toDomain(dto: IDoreReceptionOriginResponse): IDoreReceptionOriginResponse {
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
        }
    },

    toDTO(domain: IDoreReceptionOriginResponse): IDoreReceptionOriginResponse {
        return {
            id: domain.id,
            name: domain.name,
            description: domain.description,
        }
    }
}