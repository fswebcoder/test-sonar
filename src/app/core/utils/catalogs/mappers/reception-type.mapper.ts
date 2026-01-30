import { IReceptionTypeResponse } from "@/domain/entities/common/reception-type-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";

export const receptionTypeMapper: Mapper<IReceptionTypeResponse, IReceptionTypeResponse> = {
    toDomain(dto: IReceptionTypeResponse): IReceptionTypeResponse {
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
        }
    },

    toDTO(domain: IReceptionTypeResponse): IReceptionTypeResponse {
        return {
            id: domain.id,
            name: domain.name,
            description: domain.description,
        }
    }
}