import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { ISampleType } from "@/domain/entities/common/sample-reception-origin.response.entity";
import { IDoreSampleType } from "@/domain/entities/common/dore-reception-origin-response.entity";
import { IPrinter } from "@/domain/entities/common/printers/printers.entity";
import { IDocumentTypeResponse } from "@/domain/entities/common/document-response.entity";
import { IRoleCatalogResponseEntity } from "@/domain/entities/admin/roles/role-catalog-response.entity";
import IPersonnelPosition from "@/domain/entities/common/personnel-position.entity";
import IPersonnelCatalogEntity from "@/domain/entities/common/personnel.entity";
import { IShiftConfigEntity } from "@/domain/entities/common/shift.entity";
import IPumpEntity from "@/domain/entities/common/pump.entity";
import { IAnalysisTypeResponse } from "@/domain/entities/common/analysis-type-response.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IVehicleTypeEntity } from "@/domain/entities/common/vehicle-type.entity";
import { IMaterialTypeCatalogEntity } from "@/domain/entities/common/material-type-catalog.entity";
import { IStorageZonesCatalogEntity } from "@/domain/entities/common/storage-zones-catalog.entity";
import { IVehicleCatalogEntity } from "@/domain/entities/common/vehicle-catalog.entity";
import { IDriverCatalogEntity } from "@/domain/entities/common/driver-catalog.entity";
import { IMillCatalog } from "@/domain/entities/common/mill-catalog.entity";
import { IBigBagTypeEntity } from "@/domain/entities/common/big-bag-type.entity";

export interface CommonState {
    departments: IDepartmentsResponseEntity[];
    cities: ICitiesResponseEntity[];
    sampleTypes: ISampleType[];
    doreSampleTypes: IDoreSampleType[];
    printers: IPrinter[];
    documentTypes: IDocumentTypeResponse[];
    loading: boolean;
    error: any;
    roles: IRoleCatalogResponseEntity[];
    personnelPositions: IPersonnelPosition[];
    personnel: IPersonnelCatalogEntity[];
    shiftsConfig: IShiftConfigEntity[];
    pumps: IPumpEntity[];
    analysisTypes: IAnalysisTypeResponse[];
    suppliers: IsupplierListResponseEntity[];
    vehicleTypes: IVehicleTypeEntity[];
    materialTypes: IMaterialTypeCatalogEntity[];
    storageZones: IStorageZonesCatalogEntity[];
    drivers: IDriverCatalogEntity[];
    vehicles: IVehicleCatalogEntity[];
    mills: IMillCatalog[];
    bigBagTypes: IBigBagTypeEntity[];
}

export const initialCommonState: CommonState = {
    departments: [],
    cities: [],
    sampleTypes: [],
    doreSampleTypes: [],
    printers: [],
    documentTypes: [],
    loading: false,
    error: null,
    roles: [],
    personnelPositions: [],
    personnel: [],
    shiftsConfig: [],
    pumps: [],
    analysisTypes: [],
    suppliers: [],
    vehicleTypes: [],
    materialTypes: [],
    storageZones: [],
    drivers: [],
    vehicles: [],
    mills: [],
    bigBagTypes: [],
}


