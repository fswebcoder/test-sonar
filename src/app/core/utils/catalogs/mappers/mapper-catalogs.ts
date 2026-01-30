import { CATALOG_ENTITIES, CATALOG_ENTITIES_KEYS } from "@/shared/interfaces/catalogs.type";
import { Mapper } from "@/shared/interfaces/mapper.interface";
import { CATALOG_DTO_TYPES } from "./catalogs-dto-mapper";
import { receptionTypeMapper } from "./reception-type.mapper";
import { sampleReceptionOriginMapper } from "./sample-reception-origin.mapper";
import { documentTypeMapper } from "./document-type.mapper";
import { analysisTypeMapper } from "./analysis-type.mapper";
import { cityMapper } from "./city.mapper";
import { departmentMapper } from "./department.mapper";
import { doreReceptionOriginMapper } from "./dore-reception-origin.mapper";
import { supplierMapper } from "./supplier.mapper";



export const mapperCatalogs: {
    [T in CATALOG_ENTITIES_KEYS]: Mapper<CATALOG_ENTITIES[T], CATALOG_DTO_TYPES[T]>
} = {
    'RECEPTION_TYPES': receptionTypeMapper,
    'SAMPLE_TYPES': sampleReceptionOriginMapper,
    'DOCUMENT_TYPES': documentTypeMapper,
    'ANALYSIS_TYPES': analysisTypeMapper,
    'CITIES': cityMapper,
    'DEPARTMENTS': departmentMapper,
    'DORE_RECEPTION_ORIGINS': doreReceptionOriginMapper,
    'SUPPLIERS': supplierMapper,
}
export const catalogMapper = <T extends CATALOG_ENTITIES_KEYS>(type: T): Mapper<CATALOG_ENTITIES[T], CATALOG_DTO_TYPES[T]> =>
    mapperCatalogs[type]

