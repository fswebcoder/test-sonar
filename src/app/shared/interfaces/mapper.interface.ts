export interface Mapper<DomainModel, DTO> {
    toDomain(dto: DTO): DomainModel;
    toDTO(domain: DomainModel): DTO;
}
