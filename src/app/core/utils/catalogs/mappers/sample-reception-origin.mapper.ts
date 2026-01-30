import { ISampleReceptionOrigin } from "@/domain/entities/common/sample-reception-origin.response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";

export const sampleReceptionOriginMapper: Mapper<ISampleReceptionOrigin, ISampleReceptionOrigin> = {
    toDomain(dto: ISampleReceptionOrigin): ISampleReceptionOrigin {
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
        }
    },

    toDTO(domain: ISampleReceptionOrigin): ISampleReceptionOrigin {
        return {
            id: domain.id,
            name: domain.name,
            description: domain.description,
        }
    }
}