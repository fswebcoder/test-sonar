import { IAnalysisTypeResponse } from "@/domain/entities/common/analysis-type-response.entity";
import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { IDocumentTypeResponse } from "@/domain/entities/common/document-response.entity";
import { IDoreSampleType } from "@/domain/entities/common/dore-reception-origin-response.entity";
import { IReceptionTypeResponse } from "@/domain/entities/common/reception-type-response.entity";
import { ISampleType } from "@/domain/entities/common/sample-reception-origin.response.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { CATALOG_ENTITIES_KEYS } from "@/shared/interfaces/catalogs.type";

export interface ICatalogDtoMapping {
    'DOCUMENT_TYPES': IDocumentTypeResponse,
    'RECEPTION_TYPES': IReceptionTypeResponse,
    'ANALYSIS_TYPES': IAnalysisTypeResponse,
    'CITIES': ICitiesResponseEntity,
    'DEPARTMENTS': IDepartmentsResponseEntity,
    'DORE_RECEPTION_ORIGINS': IDoreSampleType,
    'SAMPLE_TYPES': ISampleType,
    'SUPPLIERS': IsupplierListResponseEntity
}

export type CATALOG_DTO_TYPES = {
    [K in CATALOG_ENTITIES_KEYS]: ICatalogDtoMapping[K];
};
