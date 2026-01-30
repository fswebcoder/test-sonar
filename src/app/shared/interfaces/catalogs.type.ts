import { IRoleCatalogResponseEntity } from "@/domain/entities/admin/roles/role-catalog-response.entity"
import { IAnalysisTypeResponse } from "@/domain/entities/common/analysis-type-response.entity"
import { IBigBagTypeEntity } from "@/domain/entities/common/big-bag-type.entity"
import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity"
import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity"
import { IDocumentTypeResponse } from "@/domain/entities/common/document-response.entity"
import { IDoreSampleType } from "@/domain/entities/common/dore-reception-origin-response.entity"
import { IDriverCatalogEntity } from "@/domain/entities/common/driver-catalog.entity"
import { IMaterialTypeCatalogEntity } from "@/domain/entities/common/material-type-catalog.entity"
import { IMillCatalog } from "@/domain/entities/common/mill-catalog.entity"
import { INotificationTypeCatalogEntity } from "@/domain/entities/common/notification-type-catalog.entity"
import IPersonnelPosition from "@/domain/entities/common/personnel-position.entity"
import IPersonnelEntity from "@/domain/entities/common/personnel.entity"
import IPumpEntity from "@/domain/entities/common/pump.entity"
import { IReceptionTypeResponse } from "@/domain/entities/common/reception-type-response.entity"
import { ISampleType } from "@/domain/entities/common/sample-reception-origin.response.entity"
import { IShiftConfigEntity } from "@/domain/entities/common/shift.entity"
import { IStorageZonesCatalogEntity } from "@/domain/entities/common/storage-zones-catalog.entity"
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity"
import { IVehicleCatalogEntity } from "@/domain/entities/common/vehicle-catalog.entity"
import { IVehicleTypeEntity } from "@/domain/entities/common/vehicle-type.entity"

export type CATALOG_ENTITIES = {
    'DOCUMENT_TYPES': IDocumentTypeResponse,
    'RECEPTION_TYPES': IReceptionTypeResponse,
    'ANALYSIS_TYPES': IAnalysisTypeResponse,
    'CITIES': ICitiesResponseEntity,
    'DEPARTMENTS': IDepartmentsResponseEntity,
    'DORE_RECEPTION_ORIGINS': IDoreSampleType,
    'SAMPLE_TYPES': ISampleType,
    'SUPPLIERS': IsupplierListResponseEntity,
    'ROLES': IRoleCatalogResponseEntity,
    'ROLES_INTERNAL': IRoleCatalogResponseEntity,
    'PERSONNEL': IPersonnelEntity,
    'PERSONNEL_POSITIONS': IPersonnelPosition,
    'SHIFTS_CONFIG': IShiftConfigEntity,
    'PUMPS': IPumpEntity,
    'VEHICLE_TYPES': IVehicleTypeEntity,
    'MATERIAL_TYPES': IMaterialTypeCatalogEntity,
    'STORAGE_ZONES': IStorageZonesCatalogEntity,
    'DRIVERS': IDriverCatalogEntity,
    'VEHICLES': IVehicleCatalogEntity,
    'MILLS': IMillCatalog,
    'BIG_BAG_TYPES': IBigBagTypeEntity,
    'NOTIFICATION_TYPES': INotificationTypeCatalogEntity,
}

export type CATALOG_ENTITIES_KEYS = keyof CATALOG_ENTITIES
