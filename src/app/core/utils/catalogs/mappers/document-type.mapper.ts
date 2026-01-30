import { IDocumentTypeResponse } from "@/domain/entities/common/document-response.entity";
import { Mapper } from "@/shared/interfaces/mapper.interface";

export const documentTypeMapper: Mapper<IDocumentTypeResponse, IDocumentTypeResponse> = {
    toDomain(dto: IDocumentTypeResponse): IDocumentTypeResponse {
        return {
            id: dto.id,
            name: dto.name,
            code: dto.code,

        }
    },

    toDTO(domain: IDocumentTypeResponse): IDocumentTypeResponse {
        return {
            id: domain.id,
            name: domain.name,
            code: domain.code,
        }
    },


}