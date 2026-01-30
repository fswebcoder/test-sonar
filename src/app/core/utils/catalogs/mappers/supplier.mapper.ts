import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";


export const supplierMapper: Mapper<IsupplierListResponseEntity, IsupplierListResponseEntity> = {
    toDomain(dto: IsupplierListResponseEntity): IsupplierListResponseEntity {
        return {
            id: dto.id,
            name: dto.name,
            documentTypeId: dto.documentTypeId,
            documentNumber: dto.documentNumber,
        }
    },

    toDTO(domain: IsupplierListResponseEntity): IsupplierListResponseEntity {
        return {
            id: domain.id,
            name: domain.name,
            documentTypeId: domain.documentTypeId,
            documentNumber: domain.documentNumber,
        }
    }
}
