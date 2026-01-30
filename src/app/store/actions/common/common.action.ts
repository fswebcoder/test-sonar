import { IRoleCatalogResponseEntity } from "@/domain/entities/admin/roles/role-catalog-response.entity";
import { IAnalysisTypeResponse } from "@/domain/entities/common/analysis-type-response.entity";
import { IBigBagTypeEntity } from "@/domain/entities/common/big-bag-type.entity";
import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { IDocumentTypeResponse } from "@/domain/entities/common/document-response.entity";
import { IDoreSampleType } from "@/domain/entities/common/dore-reception-origin-response.entity";
import { IDriverCatalogEntity } from "@/domain/entities/common/driver-catalog.entity";
import { IMaterialTypeCatalogEntity } from "@/domain/entities/common/material-type-catalog.entity";
import { IMillCatalog } from "@/domain/entities/common/mill-catalog.entity";
import IPersonnelPosition from "@/domain/entities/common/personnel-position.entity";
import IPersonnelCatalogEntity from "@/domain/entities/common/personnel.entity";
import { IPrinter } from "@/domain/entities/common/printers/printers.entity";
import IPumpEntity from "@/domain/entities/common/pump.entity";
import { ISampleType } from "@/domain/entities/common/sample-reception-origin.response.entity";
import { IShiftConfigEntity } from "@/domain/entities/common/shift.entity";
import { IStorageZonesCatalogEntity } from "@/domain/entities/common/storage-zones-catalog.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IVehicleCatalogEntity } from "@/domain/entities/common/vehicle-catalog.entity";
import { IVehicleTypeEntity } from "@/domain/entities/common/vehicle-type.entity";
import { createAction, props } from "@ngrx/store";

export const DEPARTMENTS_LIST = '[DEPARTMENTS] departments list';
export const DEPARTMENTS_LIST_SUCCESS = '[DEPARTMENTS] departments list success';
export const DEPARTMENTS_LIST_FAILURE = '[DEPARTMENTS] departments list failure';

export const GET_CITIES = '[CITIES] get cities';
export const CITIES_LIST_SUCCESS = '[CITIES] cities list success';
export const CITIES_LIST_FAILURE = '[CITIES] cities list failure';

export const GET_DORE_RECEPTION_ORIGINS = '[DORE_RECEPTION_ORIGINS] get dore reception origins';
export const DORE_RECEPTION_ORIGINS_LIST_SUCCESS = '[DORE_RECEPTION_ORIGINS] dore reception origins list success';
export const DORE_RECEPTION_ORIGINS_LIST_FAILURE = '[DORE_RECEPTION_ORIGINS] dore reception origins list failure';

export const GET_PRINTERS = '[PRINTERS] get printers';
export const PRINTERS_LIST_SUCCESS = '[PRINTERS] printers list success';
export const PRINTERS_LIST_FAILURE = '[PRINTERS] printers list failure';

export const GET_DOCUMENT_TYPES = '[DOCUMENT_TYPES] get document types';
export const DOCUMENT_TYPES_LIST_SUCCESS = '[DOCUMENT_TYPES] document types list success';
export const DOCUMENT_TYPES_LIST_FAILURE = '[DOCUMENT_TYPES] document types list failure';

export const GET_ROLES_INTERNAL = '[ROLES_INTERNAL] get roles';
export const ROLES_INTERNAL_LIST_SUCCESS = '[ROLES_INTERNAL] roles list success';
export const ROLES_INTERNAL_LIST_FAILURE = '[ROLES_INTERNAL] roles list failure';

// Backwards-compatible aliases
export const GET_ROLES = GET_ROLES_INTERNAL;
export const ROLES_LIST_SUCCESS = ROLES_INTERNAL_LIST_SUCCESS;
export const ROLES_LIST_FAILURE = ROLES_INTERNAL_LIST_FAILURE;

export const GET_PERSONNEL = '[PERSONNEL] get personnel';
export const PERSONNEL_LIST_SUCCESS = '[PERSONNEL] personnel list success';
export const PERSONNEL_LIST_FAILURE = '[PERSONNEL] personnel list failure';

export const GET_PERSONNEL_POSITION = '[PERSONNEL] get personnel position';
export const PERSONNEL_POSITION_SUCCESS = '[PERSONNEL] personnel position success';
export const PERSONNEL_POSITION_FAILURE = '[PERSONNEL] personnel position failure';

export const GET_SHIFTS_CONFIG = '[SHIFT] get shift config';
export const SHIFTS_CONFIG_LIST_SUCCESS = '[SHIFT] shift config list success';
export const SHIFTS_CONFIG_LIST_FAILURE = '[SHIFT] shift config list failure';

export const GET_PUMPS = '[PUMPS] get pumps';
export const PUMPS_LIST_SUCCESS = '[PUMPS] pumps list success';
export const PUMPS_LIST_FAILURE = '[PUMPS] pumps list failure';

export const GET_ANALYSIS_TYPES = '[ANALYSIS_TYPES] get analysis types';
export const ANALYSIS_TYPES_LIST_SUCCESS = '[ANALYSIS_TYPES] analysis types list success';
export const ANALYSIS_TYPES_LIST_FAILURE = '[ANALYSIS_TYPES] analysis types list failure';

export const GET_SAMPLE_TYPES = '[SAMPLE_TYPES] get sample types';
export const SAMPLE_TYPES_LIST_SUCCESS = '[SAMPLE_TYPES] sample types list success';
export const SAMPLE_TYPES_LIST_FAILURE = '[SAMPLE_TYPES] sample types list failure';

export const SUPPLIERS_LIST = '[SUPPLIERS] suppliers list';
export const SUPPLIERS_LIST_SUCCESS = '[SUPPLIERS] suppliers list success';
export const SUPPLIERS_LIST_FAILURE = '[SUPPLIERS] suppliers list failure';

export const GET_VEHICLE_TYPES = '[VEHICLE_TYPES] get vehicle types';
export const VEHICLE_TYPES_LIST_SUCCESS = '[VEHICLE_TYPES] vehicle types list success';
export const VEHICLE_TYPES_LIST_FAILURE = '[VEHICLE_TYPES] vehicle types list failure';

export const MATERIAL_TYPES = '[MATERIAL_TYPES] material types';
export const MATERIAL_TYPES_SUCCESS = '[MATERIAL_TYPES] material types success';
export const MATERIAL_TYPES_FAILURE = '[MATERIAL_TYPES] material types failure';

export const STORAGE_ZONES = '[STORAGE_ZONES] storage zones';
export const STORAGE_ZONES_SUCCESS = '[STORAGE_ZONES] storage zones success';
export const STORAGE_ZONES_FAILURE = '[STORAGE_ZONES] storage zones failure';

export const DRIVERS = '[DRIVERS] drivers';
export const DRIVERS_SUCCESS = '[DRIVERS] drivers success';
export const DRIVERS_FAILURE = '[DRIVERS] drivers failure';

export const VEHICLES = '[VEHICLES] vehicles';
export const VEHICLES_SUCCESS = '[VEHICLES] vehicles success';
export const VEHICLES_FAILURE = '[VEHICLES] vehicles failure';

export const MILLS = '[MILLS] mills';
export const MILLS_SUCCESS = '[MILLS] mills success';
export const MILLS_FAILURE = '[MILLS] mills failure';

export const BIG_BAG_TYPES = '[BIG_BAG_TYPES] big bag types';
export const BIG_BAG_TYPES_SUCCESS = '[BIG_BAG_TYPES] big bag types success';
export const BIG_BAG_TYPES_FAILURE = '[BIG_BAG_TYPES] big bag types failure';

export const getDepartmentsAction = createAction(DEPARTMENTS_LIST);
export const departmentsListSuccessAction = createAction(DEPARTMENTS_LIST_SUCCESS ,
    props<{ departments: IDepartmentsResponseEntity[] }>()
);
export const departmentsListFailureAction = createAction(DEPARTMENTS_LIST_FAILURE,
    props<{ error: any }>()
);


export const getCitiesAction = createAction(GET_CITIES);
export const citiesListSuccessAction = createAction(CITIES_LIST_SUCCESS,
    props<{ cities: ICitiesResponseEntity[] }>()
);
export const citiesListFailureAction = createAction(CITIES_LIST_FAILURE,
    props<{ error: any }>()
);

export const getDoreReceptionOriginsAction = createAction(GET_DORE_RECEPTION_ORIGINS);
export const doreReceptionOriginsListSuccessAction = createAction(DORE_RECEPTION_ORIGINS_LIST_SUCCESS,
    props<{ doreReceptionOrigins: IDoreSampleType[] }>()
);
export const doreReceptionOriginsListFailureAction = createAction(DORE_RECEPTION_ORIGINS_LIST_FAILURE,
    props<{ error: any }>()
);

export const getDocumentTypesAction = createAction(GET_DOCUMENT_TYPES);
export const documentTypesListSuccessAction = createAction(DOCUMENT_TYPES_LIST_SUCCESS,
    props<{ documentTypes: IDocumentTypeResponse[] }>()
);
export const documentTypesListFailureAction = createAction(DOCUMENT_TYPES_LIST_FAILURE,
    props<{ error: any }>()
);

export const getRolesInternalAction = createAction(GET_ROLES_INTERNAL);
export const rolesInternalListSuccessAction = createAction(ROLES_INTERNAL_LIST_SUCCESS,
    props<{ roles: IRoleCatalogResponseEntity[] }>()
);
export const rolesInternalListFailureAction = createAction(ROLES_INTERNAL_LIST_FAILURE,
    props<{ error: any }>()
);

// Backwards-compatible aliases
export const getRolesAction = getRolesInternalAction;
export const rolesListSuccessAction = rolesInternalListSuccessAction;
export const rolesListFailureAction = rolesInternalListFailureAction;

export const getPrintersAction = createAction(GET_PRINTERS);
export const printersListSuccessAction = createAction(PRINTERS_LIST_SUCCESS,
    props<{ printers: IPrinter[] }>()
);
export const printersListFailureAction = createAction(PRINTERS_LIST_FAILURE,
    props<{ error: any }>()
);

export const getPersonnelAction = createAction(GET_PERSONNEL);
export const personnelListSuccessAction = createAction(PERSONNEL_LIST_SUCCESS,
    props<{ personnel: IPersonnelCatalogEntity[] }>()
);
export const personnelListFailureAction = createAction(PERSONNEL_LIST_FAILURE,
    props<{ error: any }>()
);

export const getPersonnelPositionAction = createAction(GET_PERSONNEL_POSITION);
export const personnelPositionSuccessAction = createAction(PERSONNEL_POSITION_SUCCESS,
    props<{ personnelPositions: IPersonnelPosition[] }>()
);
export const personnelPositionFailureAction = createAction(PERSONNEL_POSITION_FAILURE,
    props<{ error: any }>()
);

export const getShiftsConfigAction = createAction(GET_SHIFTS_CONFIG);
export const shiftsConfigListSuccessAction = createAction(SHIFTS_CONFIG_LIST_SUCCESS,
    props<{ shiftsConfig: IShiftConfigEntity[] }>()
);
export const shiftsConfigListFailureAction = createAction(SHIFTS_CONFIG_LIST_FAILURE,
    props<{ error: any }>()
);

export const getPumpsAction = createAction(GET_PUMPS);
export const pumpsListSuccessAction = createAction(PUMPS_LIST_SUCCESS,
    props<{ pumps: IPumpEntity[] }>()
);
export const pumpsListFailureAction = createAction(PUMPS_LIST_FAILURE,
    props<{ error: any }>()
);

export const getAnalysisTypesAction = createAction(GET_ANALYSIS_TYPES);
export const analysisTypesListSuccessAction = createAction(ANALYSIS_TYPES_LIST_SUCCESS,
    props<{ analysisTypes: IAnalysisTypeResponse[] }>()
);
export const analysisTypesListFailureAction = createAction(ANALYSIS_TYPES_LIST_FAILURE,
    props<{ error: any }>()
);

export const getSampleTypesAction = createAction(GET_SAMPLE_TYPES);
export const sampleTypesListSuccessAction = createAction(SAMPLE_TYPES_LIST_SUCCESS,
    props<{ sampleTypes: ISampleType[] }>()
);
export const sampleTypesListFailureAction = createAction(SAMPLE_TYPES_LIST_FAILURE,
    props<{ error: any }>()
);

export const getSuppliersAction = createAction(SUPPLIERS_LIST);
export const suppliersListSuccessAction = createAction(SUPPLIERS_LIST_SUCCESS,
    props<{ suppliers: IsupplierListResponseEntity[] }>()
);
export const suppliersListFailureAction = createAction(SUPPLIERS_LIST_FAILURE,
    props<{ error: any }>()
);

export const getVehicleTypesAction = createAction(GET_VEHICLE_TYPES);
export const vehicleTypesListSuccessAction = createAction(VEHICLE_TYPES_LIST_SUCCESS,
    props<{ vehicleTypes: IVehicleTypeEntity[] }>()
);
export const vehicleTypesListFailureAction = createAction(VEHICLE_TYPES_LIST_FAILURE,
    props<{ error: any }>()
);

export const getMaterialTypesAction = createAction(MATERIAL_TYPES);
export const materialTypesSuccessAction = createAction(MATERIAL_TYPES_SUCCESS,
    props<{ materialTypes: IMaterialTypeCatalogEntity[] }>()
);
export const materialTypesFailureAction = createAction(MATERIAL_TYPES_FAILURE,
    props<{ error: any }>()
);

export const getStorageZonesAction = createAction(STORAGE_ZONES);
export const storageZonesSuccessAction = createAction(STORAGE_ZONES_SUCCESS,
    props<{ storageZones: IStorageZonesCatalogEntity[] }>()
);
export const storageZonesFailureAction = createAction(STORAGE_ZONES_FAILURE,
    props<{ error: any }>()
);

export const getDriversAction = createAction(DRIVERS);
export const driversSuccessAction = createAction(DRIVERS_SUCCESS,
    props<{ drivers: IDriverCatalogEntity[] }>()
);
export const driversFailureAction = createAction(DRIVERS_FAILURE,
    props<{ error: any }>()
);

export const getVehiclesAction = createAction(VEHICLES);
export const vehiclesSuccessAction = createAction(VEHICLES_SUCCESS,
    props<{ vehicles: IVehicleCatalogEntity[] }>()
);
export const vehiclesFailureAction = createAction(VEHICLES_FAILURE,
    props<{ error: any }>()
);

export const getMillsAction = createAction(MILLS);
export const millsSuccessAction = createAction(MILLS_SUCCESS,
    props<{ mills: IMillCatalog[] }>()
);
export const millsFailureAction = createAction(MILLS_FAILURE,
    props<{ error: any }>()
);

export const getBigBagTypesAction = createAction(BIG_BAG_TYPES);
export const bigBagTypesSuccessAction = createAction(BIG_BAG_TYPES_SUCCESS,
    props<{ bigBagTypes: IBigBagTypeEntity[] }>()
);
export const bigBagTypesFailureAction = createAction(BIG_BAG_TYPES_FAILURE,
    props<{ error: any }>()
);