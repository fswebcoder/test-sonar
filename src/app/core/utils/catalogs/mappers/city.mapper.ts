import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";

export const cityMapper: Mapper<ICitiesResponseEntity, ICitiesResponseEntity> = {
    toDomain(dto: ICitiesResponseEntity): ICitiesResponseEntity {
        return {
            id: dto.id,
            name: dto.name,
            departmentId: dto.departmentId,
        }
    },

    toDTO(domain: ICitiesResponseEntity): ICitiesResponseEntity {
        return {
            id: domain.id,
            name: domain.name,
            departmentId: domain.departmentId,
        }
    }
}