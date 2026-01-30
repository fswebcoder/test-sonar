import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";


export const departmentMapper: Mapper<IDepartmentsResponseEntity, IDepartmentsResponseEntity> = {
    toDomain(dto: IDepartmentsResponseEntity): IDepartmentsResponseEntity {
        return {
            id: dto.id,
            name: dto.name,
            code: dto.code,
            countryId: dto.countryId,
        }
    },

    toDTO(domain: IDepartmentsResponseEntity): IDepartmentsResponseEntity {
        return {
            id: domain.id,
            name: domain.name,
            code: domain.code,
            countryId: domain.countryId,
        }
    }
}